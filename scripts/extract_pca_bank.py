#!/usr/bin/env python3
"""Build the Veyra PCA question bank from the OCR output of PCA.pdf.

The source document is image-only. Correct answers are printed in bold, so this
extractor combines OCR text with a pixel-density check on the option line. When
an explanation explicitly identifies two incorrect choices, that textual clue
is used as an independent cross-check.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import statistics
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageFilter


QUESTION_COUNT = 457

# Answers checked directly against the printed page and its worked calculation.
# These short numeric choices are difficult to distinguish reliably by ink density.
ANSWER_OVERRIDES = {
    417: "A",
    418: "C",
    446: "C",
}

CATEGORY_RANGES = (
    (1, 67, "Aerodinámica básica"),
    (68, 102, "Sistemas de aeronaves"),
    (103, 131, "Instrumentos de vuelo"),
    (132, 193, "Reglamentación"),
    (194, 272, "Procedimientos y operaciones de aeródromos"),
    (273, 362, "Meteorología"),
    (363, 401, "Servicios meteorológicos"),
    (402, 427, "Performance de la aeronave"),
    (428, 457, "Navegación"),
)

SECTION_LINE = re.compile(
    r"^\s*[1-9]\.\s*(?:Aerodinamica basica|Sistemas de aeronaves|"
    r"Instrumentos de vuelo|Reglamentacion|Procedimientos y operaciones de aer[o6]dromos|"
    r"Meteorologia|Servicios meteorol[oé]gicos|Performance de la aeronave|Navegacion)\s*$",
    re.IGNORECASE,
)
QUESTION_LINE = re.compile(r"^\s*(\d{1,3})\s*[.,]*\s*-\s*")
QUESTION_TOKEN = re.compile(r"^(\d{1,3})[.,]*-")
OPTION_MARKER = re.compile(r"(?<!\S)([ABC])[.:]\s*")
EXPLANATION_LINE = re.compile(r"^\s*Explica", re.IGNORECASE)
FOOTER_LINE = re.compile(r"^\s*-\s*\d+\s*-\s*$")

MISSING_EXPLANATION_PREFIX = {
    158: "Se requiere una luz de aterrizaje",
    159: "Se requiere equipo de flotaci",
    164: "Las baterias del ELT",
    192: "Los transmisores de localizaci",
    445: "Utilizando un computador de vuelo",
}


@dataclass
class Word:
    page: int
    block: int
    paragraph: int
    line: int
    word: int
    left: int
    top: int
    width: int
    height: int
    text: str

    @property
    def line_key(self) -> tuple[int, int, int, int]:
        return (self.page, self.block, self.paragraph, self.line)


def category_for(number: int) -> str:
    for first, last, label in CATEGORY_RANGES:
        if first <= number <= last:
            return label
    raise ValueError(f"No category configured for question {number}")


def source_sort_key(path: Path) -> int:
    match = re.search(r"(\d+)$", path.stem)
    if not match:
        raise ValueError(f"Page number missing in {path}")
    return int(match.group(1))


def is_artifact(line: str) -> bool:
    value = line.strip()
    if not value:
        return False
    if FOOTER_LINE.match(value) or SECTION_LINE.match(value):
        return True
    if value.upper().startswith("BANCO DE PREGUNTAS DE PILOTO COMERCIAL"):
        return True
    if re.fullmatch(r"[~-]?(?:[A-Z]?\d+|\d+[A-Z]?)[-.]?", value):
        return True
    return value in {"Oo", "re", "ES"}


def normalize_text(value: str) -> str:
    value = unicodedata.normalize("NFC", value)
    value = value.replace("\u00ad", "")
    value = re.sub(r"(?<=[A-Za-zÁÉÍÓÚÜÑáéíóúüñ])6n\b", "ón", value)
    value = re.sub(r"(?<=[a-záéíóúüñ])6o(?=[a-záéíóúüñ])", "ó", value)
    value = re.sub(r"\baer6drom", "aeródrom", value, flags=re.IGNORECASE)
    value = re.sub(r"\bExplicaci(?:6|é|o)n\b", "Explicación", value, flags=re.IGNORECASE)
    value = re.sub(r"\s+([,.;:?])", r"\1", value)
    value = re.sub(r"\s+", " ", value).strip()
    value = re.sub(r"(?<!\w)[~¢{]\s*(?=[A-Za-zÁÉÍÓÚÜÑáéíóúüñ])", "¿", value)
    value = re.sub(
        r"(?<!\w)g(?=(Que|Qué|Cual|Cuál|Como|Cómo|Cuando|Cuándo|Donde|Dónde|Por que|Por qué)\b)",
        "¿",
        value,
        flags=re.IGNORECASE,
    )
    value = re.sub(r"\b4[Aa]\s+(?=qué\b)", "¿A ", value, flags=re.IGNORECASE)
    value = re.sub(r"^-\s*", "", value)

    ocr_word_fixes = {
        "avidn": "avión",
        "avin": "avión",
        "avion": "avión",
        "presién": "presión",
        "presidn": "presión",
        "presion": "presión",
        "prondstico": "pronóstico",
        "prondsticos": "pronósticos",
        "aerddromo": "aeródromo",
        "aerddromos": "aeródromos",
        "sefial": "señal",
        "sefiales": "señales",
        "sefiala": "señala",
        "sefalados": "señalados",
        "dafio": "daño",
        "dafios": "daños",
        "dafos": "daños",
        "timén": "timón",
        "disefo": "diseño",
        "acta": "actúa",
    }
    for bad_word, good_word in ocr_word_fixes.items():
        value = re.sub(
            rf"\b{bad_word}\b",
            lambda match, replacement=good_word: (
                replacement.capitalize() if match.group(0)[0].isupper() else replacement
            ),
            value,
            flags=re.IGNORECASE,
        )
    if value.endswith("?") and not value.startswith("¿"):
        if re.match(r"^(Que|Qué|Cual|Cuál|Como|Cómo|Cuando|Cuándo|Donde|Dónde|Por que|Por qué)\b", value, re.IGNORECASE):
            value = "¿" + value
    return value


def load_text_lines(ocr_dir: Path) -> list[tuple[int, int, str]]:
    lines: list[tuple[int, int, str]] = []
    for path in sorted(ocr_dir.glob("page-*.txt"), key=source_sort_key):
        page = source_sort_key(path)
        for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            lines.append((page, line_number, line.rstrip()))
    return lines


def locate_question_lines(lines: list[tuple[int, int, str]]) -> list[int]:
    starts: list[int] = []
    expected = 1
    for index, (_, _, line) in enumerate(lines):
        match = QUESTION_LINE.match(line)
        if match and int(match.group(1)) == expected:
            starts.append(index)
            expected += 1
            if expected > QUESTION_COUNT:
                break
    if len(starts) != QUESTION_COUNT:
        raise ValueError(
            f"Expected {QUESTION_COUNT} numbered questions, found {len(starts)}; next expected {expected}"
        )
    return starts


def split_missing_explanation(number: int, lines: list[str]) -> tuple[list[str], list[str]]:
    prefix = MISSING_EXPLANATION_PREFIX.get(number)
    if not prefix:
        raise ValueError(f"Question {number} has no explanation heading and no configured split")
    plain_prefix = unicodedata.normalize("NFKD", prefix).encode("ascii", "ignore").decode().lower()
    seen_option_c = False
    for index, line in enumerate(lines):
        if re.match(r"^\s*C[.,:]", line):
            seen_option_c = True
        plain_line = unicodedata.normalize("NFKD", line).encode("ascii", "ignore").decode().lower()
        if seen_option_c and plain_line.startswith(plain_prefix):
            return lines[:index], lines[index:]
    raise ValueError(f"Could not locate explanation prefix for question {number}: {prefix}")


def clean_lines(lines: Iterable[str]) -> list[str]:
    return [line.strip() for line in lines if not is_artifact(line)]


def split_option_line(line: str) -> list[tuple[str | None, str]]:
    raw_matches = list(OPTION_MARKER.finditer(line))
    matches = []
    for index, match in enumerate(raw_matches):
        stop = raw_matches[index + 1].start() if index + 1 < len(raw_matches) else len(line)
        if re.search(r"[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ]", line[match.end() : stop]):
            matches.append(match)
    if matches:
        parts: list[tuple[str | None, str]] = []
        if matches[0].start() > 0:
            parts.append((None, line[: matches[0].start()].strip()))
        for index, match in enumerate(matches):
            stop = matches[index + 1].start() if index + 1 < len(matches) else len(line)
            parts.append((match.group(1), line[match.end() : stop].strip()))
        return parts
    return [(None, line.strip())]


def parse_text_question(number: int, segment: list[tuple[int, int, str]]) -> dict[str, str]:
    lines = clean_lines(line for _, _, line in segment)
    if not lines:
        raise ValueError(f"Question {number} has no OCR text")
    lines[0] = QUESTION_LINE.sub("", lines[0], count=1).strip()

    explanation_index = next((i for i, line in enumerate(lines) if EXPLANATION_LINE.match(line)), None)
    if explanation_index is None:
        prompt_lines, explanation_lines = split_missing_explanation(number, lines)
    else:
        prompt_lines = lines[:explanation_index]
        explanation_lines = lines[explanation_index + 1 :]

    if not any(re.match(r"^\s*A[.:]\s*", line) for line in prompt_lines):
        attached_a = next(
            (index for index, line in enumerate(prompt_lines) if re.search(r"A[.:]\s*$", line)),
            None,
        )
        if attached_a is not None:
            prompt_lines[attached_a] = re.sub(r"A[.:]\s*$", "", prompt_lines[attached_a]).rstrip()
            first_text = next(
                (index for index in range(attached_a + 1, len(prompt_lines)) if prompt_lines[index].strip()),
                None,
            )
            if first_text is not None:
                prompt_lines[first_text] = "A. " + prompt_lines[first_text].lstrip()

    if number == 421:
        prompt_lines = [
            "C. Opción no consignada en el documento fuente."
            if re.fullmatch(r"Cc?[.:]", line.strip(), flags=re.IGNORECASE)
            else line
            for line in prompt_lines
        ]

    # Tesseract occasionally reads the printed marker "C." as "Cc.".
    prompt_lines = [re.sub(r"^\s*Cc[.:]\s*", "C. ", line, flags=re.IGNORECASE) for line in prompt_lines]

    buckets: dict[str, list[str]] = {"question": [], "A": [], "B": [], "C": []}
    active = "question"
    expected = "A"
    for line_index, line in enumerate(prompt_lines):
        if active == "question" and not re.match(r"^\s*A[.:]\s*", line):
            plain_a = line_index > 0 and re.match(r"^\s*A\s+", line)
            later_has_b = any(re.match(r"^\s*B[.:]\s*", item) for item in prompt_lines[line_index + 1 :])
            later_has_c = any(re.match(r"^\s*C[.:]\s*", item) for item in prompt_lines[line_index + 1 :])
            if plain_a and later_has_b and later_has_c:
                line = re.sub(r"^\s*A\s+", "A. ", line, count=1)
            else:
                if line:
                    buckets["question"].append(line)
                continue
        for marker, text in split_option_line(line):
            if marker is not None:
                if marker == "C" and expected == "B":
                    another_c_follows = any(
                        re.match(r"^\s*C[.:]\s*", item)
                        for item in prompt_lines[line_index + 1 :]
                    )
                    if another_c_follows:
                        marker = "B"
                if marker != expected:
                    raise ValueError(
                        f"Question {number}: expected option {expected}, encountered {marker} in {line!r}"
                    )
                active = marker
                expected = chr(ord(expected) + 1) if expected != "C" else "D"
            if text:
                buckets[active].append(text)

    if expected != "D":
        raise ValueError(f"Question {number}: options A-C were not all detected")

    parsed = {
        "question": normalize_text(" ".join(buckets["question"])),
        "option_a": normalize_text(" ".join(buckets["A"])),
        "option_b": normalize_text(" ".join(buckets["B"])),
        "option_c": normalize_text(" ".join(buckets["C"])),
        "explanation": normalize_text(" ".join(explanation_lines)),
    }
    if not all(parsed[key] for key in ("question", "option_a", "option_b", "option_c", "explanation")):
        raise ValueError(f"Question {number}: one or more required text fields are empty")
    return parsed


def load_words(ocr_dir: Path) -> list[Word]:
    words: list[Word] = []
    for path in sorted(ocr_dir.glob("page-*.tsv"), key=source_sort_key):
        page = source_sort_key(path)
        with path.open(encoding="utf-8", newline="") as stream:
            rows = csv.DictReader(stream, delimiter="\t", quoting=csv.QUOTE_NONE)
            for row in rows:
                text = (row.get("text") or "").strip()
                if row.get("level") != "5" or not text:
                    continue
                words.append(
                    Word(
                        page=page,
                        block=int(row["block_num"]),
                        paragraph=int(row["par_num"]),
                        line=int(row["line_num"]),
                        word=int(row["word_num"]),
                        left=int(row["left"]),
                        top=int(row["top"]),
                        width=int(row["width"]),
                        height=int(row["height"]),
                        text=text,
                    )
                )
    return words


def locate_question_words(words: list[Word]) -> list[int]:
    starts: list[int] = []
    expected = 1
    for index, word in enumerate(words):
        match = QUESTION_TOKEN.match(word.text)
        if match and int(match.group(1)) == expected:
            starts.append(index)
            expected += 1
            if expected > QUESTION_COUNT:
                break
    if len(starts) != QUESTION_COUNT:
        raise ValueError(
            f"Expected {QUESTION_COUNT} word-level question starts, found {len(starts)}; next expected {expected}"
        )
    return starts


def option_marker(word: Word, letter: str) -> bool:
    if letter == "C" and word.text in {"Cc.", "CC."}:
        return True
    if re.fullmatch(letter + r"[.,:]", word.text):
        return True
    if word.word == 1 and word.left < 320 and re.match(letter + r"[.,:].+", word.text):
        return True
    return word.text == letter and word.word == 1 and word.left < 320


def option_positions(words: list[Word]) -> list[int]:
    positions: list[int] = []
    cursor = -1
    for letter in "ABC":
        found = next(
            (index for index, word in enumerate(words) if index > cursor and option_marker(word, letter)),
            None,
        )
        if found is None and letter == "A":
            # In question 408 the marker was fused to the final question word ("mar?A.").
            attached = next(
                (
                    index
                    for index, word in enumerate(words[:-1])
                    if index > cursor and re.search(r"A[.,:]$", word.text) and word.text not in {"A.", "A,", "A:"}
                ),
                None,
            )
            if attached is not None:
                found = attached + 1
        if found is None and letter == "B":
            # One scan (question 254) reads the printed B marker as C, yielding A/C/C.
            c_candidates = [
                index
                for index, word in enumerate(words)
                if index > cursor and option_marker(word, "C")
            ]
            if len(c_candidates) >= 2:
                found = c_candidates[0]
        if found is None:
            raise ValueError(f"Could not locate option marker {letter}")
        positions.append(found)
        cursor = found
    return positions


def word_density(image: Image.Image, word: Word) -> tuple[int, int]:
    crop = image.crop((word.left, word.top, word.left + word.width, word.top + word.height))
    ink = sum(1 for value in crop.getdata() if value < 180)
    characters = max(1, len(re.sub(r"[^A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ]", "", word.text)))
    return ink, characters * max(word.height, 1)


def word_stroke_score(image: Image.Image, word: Word) -> tuple[int, int]:
    """Estimate type weight by measuring ink that survives a 1 px erosion."""
    crop = image.crop((word.left, word.top, word.left + word.width, word.top + word.height))
    ink = sum(1 for value in crop.getdata() if value < 180)
    eroded = crop.filter(ImageFilter.MaxFilter(3))
    retained = sum(1 for value in eroded.getdata() if value < 180)
    return retained, ink


def option_density(
    words: list[Word],
    marker_index: int,
    stop_index: int,
    image_cache: dict[int, Image.Image],
    page_dir: Path,
) -> float:
    marker = words[marker_index]
    same_line = [
        word
        for word in words[marker_index:stop_index]
        if word.line_key == marker.line_key
    ]
    if len(same_line) <= 1:
        same_line = words[marker_index : min(stop_index, marker_index + 14)]

    ink_total = 0
    normalizer_total = 0
    for word in same_line:
        if word.page not in image_cache:
            image_path = page_dir / f"page-{word.page:03d}.png"
            image_cache[word.page] = Image.open(image_path).convert("L")
        ink, normalizer = word_density(image_cache[word.page], word)
        ink_total += ink
        normalizer_total += normalizer
    if normalizer_total == 0:
        raise ValueError("No measurable words on option line")
    return ink_total / normalizer_total


def option_stroke_score(
    words: list[Word],
    marker_index: int,
    stop_index: int,
    image_cache: dict[int, Image.Image],
    page_dir: Path,
) -> float:
    marker = words[marker_index]
    same_line = [
        word
        for word in words[marker_index:stop_index]
        if word.line_key == marker.line_key
    ]
    if len(same_line) <= 1:
        same_line = words[marker_index : min(stop_index, marker_index + 14)]

    retained_total = 0
    ink_total = 0
    for word in same_line:
        if word.page not in image_cache:
            image_path = page_dir / f"page-{word.page:03d}.png"
            image_cache[word.page] = Image.open(image_path).convert("L")
        retained, ink = word_stroke_score(image_cache[word.page], word)
        retained_total += retained
        ink_total += ink
    return retained_total / ink_total if ink_total else 0.0


def infer_correct_from_explanation(explanation: str) -> str | None:
    explicit = re.search(r"respuesta correcta es la\s+\(?([ABC])\)?", explanation, flags=re.IGNORECASE)
    if explicit:
        return explicit.group(1).upper()

    incorrect: set[str] = set()
    for sentence in re.split(r"(?<=[.!?])\s+", explanation):
        if "incorrect" not in sentence.lower():
            if "no es correcta" not in sentence.lower():
                continue
        incorrect.update(re.findall(r"\(([ABC])\)", sentence, flags=re.IGNORECASE))
        incorrect.update(
            re.findall(
                r"respuesta\s+\(?([ABC])\)?\s+(?:es\s+incorrecta|no\s+es\s+correcta)",
                sentence,
                flags=re.IGNORECASE,
            )
        )
    incorrect = {letter.upper() for letter in incorrect}
    if len(incorrect) == 2:
        return ({"A", "B", "C"} - incorrect).pop()
    return None


def detect_correct_answers(
    words: list[Word], starts: list[int], parsed_questions: list[dict[str, str]], page_dir: Path
) -> tuple[list[str], list[dict[str, object]]]:
    answers: list[str] = []
    qa: list[dict[str, object]] = []
    image_cache: dict[int, Image.Image] = {}
    try:
        for number, start in enumerate(starts, 1):
            stop = starts[number] if number < len(starts) else len(words)
            segment = words[start:stop]
            try:
                positions = option_positions(segment)
            except ValueError as error:
                raise ValueError(f"Question {number}: {error}") from error
            explanation_position = next(
                (index for index, word in enumerate(segment) if index > positions[2] and word.text.lower().startswith("explica")),
                len(segment),
            )
            densities: dict[str, float] = {}
            stroke_scores: dict[str, float] = {}
            for option_index, letter in enumerate("ABC"):
                option_stop = positions[option_index + 1] if option_index < 2 else explanation_position
                densities[letter] = option_density(
                    segment, positions[option_index], option_stop, image_cache, page_dir
                )
                stroke_scores[letter] = option_stroke_score(
                    segment, positions[option_index], option_stop, image_cache, page_dir
                )
            ranked = sorted(densities, key=densities.get, reverse=True)
            visual_answer = ranked[0]
            second = densities[ranked[1]]
            visual_gap = (densities[visual_answer] - second) / second if second else 1.0
            stroke_ranked = sorted(stroke_scores, key=stroke_scores.get, reverse=True)
            stroke_answer = stroke_ranked[0]
            stroke_second = stroke_scores[stroke_ranked[1]]
            stroke_gap = (
                (stroke_scores[stroke_answer] - stroke_second) / stroke_second
                if stroke_second
                else 1.0
            )
            explanation_answer = infer_correct_from_explanation(parsed_questions[number - 1]["explanation"])
            final_answer = ANSWER_OVERRIDES.get(number) or explanation_answer or visual_answer
            answers.append(final_answer)
            qa.append(
                {
                    "number": number,
                    "densities": {key: round(value, 4) for key, value in densities.items()},
                    "visual_answer": visual_answer,
                    "visual_gap": round(visual_gap, 4),
                    "stroke_scores": {key: round(value, 4) for key, value in stroke_scores.items()},
                    "stroke_answer": stroke_answer,
                    "stroke_gap": round(stroke_gap, 4),
                    "explanation_answer": explanation_answer,
                    "final_answer": final_answer,
                    "crosscheck_agrees": explanation_answer is None or explanation_answer == visual_answer,
                }
            )
    finally:
        for image in image_cache.values():
            image.close()
    return answers, qa


def build_bank(ocr_dir: Path, page_dir: Path) -> tuple[list[dict[str, object]], list[dict[str, object]]]:
    lines = load_text_lines(ocr_dir)
    line_starts = locate_question_lines(lines)
    parsed: list[dict[str, str]] = []
    for number, start in enumerate(line_starts, 1):
        stop = line_starts[number] if number < len(line_starts) else len(lines)
        parsed.append(parse_text_question(number, lines[start:stop]))

    words = load_words(ocr_dir)
    word_starts = locate_question_words(words)
    answers, qa = detect_correct_answers(words, word_starts, parsed, page_dir)

    bank: list[dict[str, object]] = []
    for number, (question, answer) in enumerate(zip(parsed, answers), 1):
        bank.append(
            {
                "question_code": f"PCA-{number:03d}",
                "license": "PCA",
                "category": category_for(number),
                "subcategory": None,
                **question,
                "option_d": None,
                "option_e": None,
                "correct_answer": answer,
                "source": "PCA.pdf · Banco de preguntas de Piloto Comercial - Avión",
                "active": number != 421,
            }
        )
    return bank, qa


def validate_bank(bank: list[dict[str, object]], qa: list[dict[str, object]]) -> None:
    if len(bank) != QUESTION_COUNT:
        raise ValueError(f"Expected {QUESTION_COUNT} questions, built {len(bank)}")
    expected_codes = [f"PCA-{number:03d}" for number in range(1, QUESTION_COUNT + 1)]
    actual_codes = [str(row["question_code"]) for row in bank]
    if actual_codes != expected_codes:
        raise ValueError("Question codes are not complete and sequential")
    for row in bank:
        if row["correct_answer"] not in {"A", "B", "C"}:
            raise ValueError(f"Invalid answer in {row['question_code']}")
        for field in ("question", "option_a", "option_b", "option_c", "explanation"):
            if not str(row[field]).strip():
                raise ValueError(f"Empty {field} in {row['question_code']}")

    weak_visual = [item for item in qa if float(item["visual_gap"]) < 0.08]
    disagreements = [item for item in qa if not bool(item["crosscheck_agrees"])]
    print(f"Questions: {len(bank)}")
    print(f"Categories: {len({str(row['category']) for row in bank})}")
    print(f"Explanation cross-checks: {sum(item['explanation_answer'] is not None for item in qa)}")
    print(f"Visual gaps below 8%: {len(weak_visual)}")
    print(f"Explanation/visual disagreements: {len(disagreements)}")
    if disagreements:
        print("Disagreement question numbers:", ", ".join(str(item["number"]) for item in disagreements))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ocr-dir", type=Path, required=True)
    parser.add_argument("--page-dir", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--qa-output", type=Path, required=True)
    args = parser.parse_args()

    bank, qa = build_bank(args.ocr_dir, args.page_dir)
    validate_bank(bank, qa)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.qa_output.parent.mkdir(parents=True, exist_ok=True)
    args.qa_output.write_text(json.dumps(qa, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
