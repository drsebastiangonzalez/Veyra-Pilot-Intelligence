(()=>{
  const load=(src,onload)=>{
    const s=document.createElement('script');
    s.src=src;
    s.onload=onload;
    document.head.appendChild(s);
  };
  load('assets/class-22-base.js?v=2',()=>load('assets/class-22-quiz-shuffle.js?v=2'));
})();
