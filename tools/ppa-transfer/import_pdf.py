"""One-time, byte-preserving transfer of the user-approved PPA v7 PDF.

The connector accepts text only. This checksum-verified payload reconstructs the
exact uploaded binary using existing PDF bytes and lossless stream transforms.
No PDF content is authored, summarized or changed here. Removed before merge.
"""
from pathlib import Path
import base64
import hashlib
import json
import lzma
import zlib

SOURCE_SHA = '8088115f40bed70d5761b78af7c6fa6e88290b9d71b7a51f1dcf787b33d88e39'
TARGET_SHA = '3ff6fe3eb028d264492a0ad7726295fa8a5116abbf57ab2272d1f0f95490a6f4'
PAYLOAD_SHA = '08af21f71ac91e0458c509ce46857e9863443ff9db5fe2f3f0bbab6d2630ac10'
TARGET_BYTES = 261196
ROOT = Path(__file__).resolve().parents[2]
PDF = ROOT / 'assets/guias/guia-rapida-chequeo-ppa-veyra.pdf'
INDEX = ROOT / 'index.html'


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def main():
    source = PDF.read_bytes()
    if sha256(source) != SOURCE_SHA:
        raise RuntimeError('Source PPA PDF changed; stop rather than overwrite.')
    encoded = ''.join((Path(__file__).parent / f'part-{n:02d}.b64').read_text().strip()
                      for n in range(1, 6))
    packed = base64.b64decode(encoded, validate=True)
    if sha256(packed) != PAYLOAD_SHA:
        raise RuntimeError('Transfer payload checksum mismatch.')
    payload = json.loads(lzma.decompress(packed))
    if (payload['source_sha256'], payload['target_sha256'], payload['target_bytes']) != (
            SOURCE_SHA, TARGET_SHA, TARGET_BYTES):
        raise RuntimeError('Unexpected transfer manifest.')
    pool = [source]
    for step in payload['steps']:
        op = step[0]
        if op == 'd':
            data = source[step[1]:step[1] + step[2]]
            if step[3]:
                data = base64.a85decode(data[:-2])
            data = zlib.decompress(data)
        elif op == 'p':
            pieces = []
            for part in step[1]:
                if isinstance(part, str):
                    pieces.append(base64.b64decode(part, validate=True))
                else:
                    sid, start, length = part
                    if sid >= len(pool) or min(sid, start, length) < 0:
                        raise RuntimeError('Invalid transfer reference.')
                    data = pool[sid][start:start + length]
                    if len(data) != length:
                        raise RuntimeError('Truncated transfer reference.')
                    pieces.append(data)
            data = b''.join(pieces)
        elif op == 'e':
            data = zlib.compress(pool[step[1]], level=step[2])
            if step[3]:
                data = base64.a85encode(data) + b'~>'
        else:
            raise RuntimeError('Unknown transfer operation.')
        if len(data) > 2_000_000:
            raise RuntimeError('Unexpected transfer output size.')
        pool.append(data)
    result = pool[-1]
    if len(result) != TARGET_BYTES or sha256(result) != TARGET_SHA:
        raise RuntimeError('Reconstructed PDF differs from the approved upload.')
    if not result.startswith(b'%PDF-') or not result.rstrip().endswith(b'%%EOF'):
        raise RuntimeError('Invalid PDF envelope.')

    # Change only the existing PPA guide button. Keep all other current content.
    index = INDEX.read_text(encoding='utf-8')
    before = '''<button class="trainingBtnGold" onclick="window.open('assets/guias/guia-rapida-chequeo-ppa-veyra.pdf','_blank','noopener')">Ver instructivo</button>'''
    after = '''<button class="trainingBtnGold" aria-label="Abrir guía de chequeo PPA v7, PDF de 26 páginas" onclick="window.open('assets/guias/guia-rapida-chequeo-ppa-veyra.pdf?v=7-3ff6fe3e','_blank','noopener')">Ver guía PPA · v7</button>'''
    if index.count(before) != 1:
        raise RuntimeError('PPA button changed; manual reconciliation required.')
    updated = index.replace(before, after, 1)
    if updated.replace(after, before, 1) != index:
        raise RuntimeError('Unexpected unrelated index change.')
    # All checks finish before writing either tracked file.
    PDF.write_bytes(result)
    INDEX.write_text(updated, encoding='utf-8')
    print(f'PDF VERIFIED: {len(result)} bytes; SHA-256 {sha256(result)}')
    print('Existing Training Center > PPA button updated; PCA routes unchanged.')


if __name__ == '__main__':
    main()
