(()=>{
  const quizEl=document.getElementById('quiz');
  const scoreEl=document.getElementById('score');
  const resetBtn=document.getElementById('resetQuiz');
  if(!quizEl||!scoreEl||!resetBtn)return;

  const questions=[
    ['Checklist means…',['complete configuration method','verification of selected critical items','replacement for SOP','post-flight list'],'verification of selected critical items'],
    ['Approved airline application is defined by…',['student memory','operator OM/SOP within applicable aircraft documentation','ATC','checklist printer'],'operator OM/SOP within applicable aircraft documentation'],
    ['Dark cockpit primarily…',['makes every light off','reduces visual noise so unexpected indications stand out','replaces ECAM','removes need for checks'],'reduces visual noise so unexpected indications stand out'],
    ['PTU automatic operation relates to…',['one engine only','~500 psi Green/Yellow differential subject to logic','APU master','gear extension only'],'~500 psi Green/Yellow differential subject to logic'],
    ['After levers go to CL…',['task complete','verify FMA and monitor','turn off FDs','select TOGA'],'verify FMA and monitor'],
    ['LOC/G/S is specifically…',['every approach','ILS guidance','taxi','engine start'],'ILS guidance'],
    ['Reverse after touchdown is…',['automatic from autobrake','pilot-selected and monitored','anti-skid function','CPC controlled'],'pilot-selected and monitored'],
    ['Anti-skid is…',['last step after reverse','continuous wheel-brake pressure modulation when available','spoiler command','thrust mode'],'continuous wheel-brake pressure modulation when available'],
    ['Stronger parking verification is…',['selector only','accumulator + brake pressure + applicable ground securing','beacon only','STATUS only'],'accumulator + brake pressure + applicable ground securing'],
    ['Use this class to…',['replace SOP','understand logic behind applicable SOP','invent a sequence','ignore OEB applicability'],'understand logic behind applicable SOP']
  ];

  const shuffle=arr=>{
    const a=[...arr];
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  };

  function renderQuiz(){
    let score=0;
    const answered=new Set();
    scoreEl.textContent='Score: 0 / 10';
    quizEl.innerHTML='';

    questions.forEach((q,qi)=>{
      const card=document.createElement('div');
      card.className='q';
      const h=document.createElement('h3');
      h.textContent=`${qi+1}. ${q[0]}`;
      const answers=document.createElement('div');
      answers.className='answers';

      shuffle(q[1]).forEach(text=>{
        const b=document.createElement('button');
        b.className='answer';
        b.textContent=text;
        b.dataset.correct=String(text===q[2]);
        b.addEventListener('click',()=>{
          if(answered.has(qi))return;
          answered.add(qi);
          if(b.dataset.correct==='true'){
            b.classList.add('correct');
            score++;
          }else{
            b.classList.add('wrong');
            answers.querySelector('[data-correct="true"]')?.classList.add('correct');
          }
          scoreEl.textContent=`Score: ${score} / 10`;
        });
        answers.appendChild(b);
      });

      card.append(h,answers);
      quizEl.appendChild(card);
    });
  }

  resetBtn.onclick=renderQuiz;
  renderQuiz();
})();
