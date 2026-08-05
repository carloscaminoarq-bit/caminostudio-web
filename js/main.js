(function(){
  "use strict";
  function safe(fn){try{fn();}catch(e){}}

  /* scroll progress */
  safe(function(){
    var p=document.getElementById('prog');if(!p)return;
    function upd(){var h=document.documentElement;var max=h.scrollHeight-h.clientHeight;
      p.style.width=(max>0?(h.scrollTop/max*100):0)+'%';}
    window.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();
  });

  /* mobile nav */
  safe(function(){
    var b=document.getElementById('burger'),n=document.getElementById('navlinks');if(!b||!n)return;
    b.addEventListener('click',function(){n.classList.toggle('open');});
    n.addEventListener('click',function(e){if(e.target.tagName==='A')n.classList.remove('open');});
  });

  /* reveal on scroll — with safety net */
  safe(function(){
    var els=[].slice.call(document.querySelectorAll('.reveal'));
    if(!('IntersectionObserver' in window)){els.forEach(function(el){el.classList.add('in');});return;}
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
    },{threshold:0.04,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){io.observe(el);});
    setTimeout(function(){els.forEach(function(el){el.classList.add('in');});},4500);
  });

  /* number counters */
  safe(function(){
    var nums=[].slice.call(document.querySelectorAll('.n[data-to]'));if(!nums.length)return;
    function run(el){
      var target=parseInt(el.getAttribute('data-to'),10)||0;
      var u=el.querySelector('.u'),s=el.querySelector('.s');
      var pre=u?u.outerHTML:'',suf=s?s.outerHTML:'';
      var t0=null,dur=1100;
      function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1);
        el.innerHTML=pre+Math.round(target*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(step);}
      requestAnimationFrame(step);
    }
    if(!('IntersectionObserver' in window)){nums.forEach(run);return;}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){run(e.target);io.unobserve(e.target);}});},{threshold:0.5});
    nums.forEach(function(el){io.observe(el);});
  });

  /* custom cursor with coordinates — fine pointer only, grows over links */
  safe(function(){
    if(!window.matchMedia||!window.matchMedia('(pointer:fine)').matches)return;
    var cur=document.getElementById('cur'),co=document.getElementById('co');if(!cur)return;
    cur.style.display='block';document.body.classList.add('cursor-on');
    var x=0,y=0,cx=0,cy=0;
    document.addEventListener('mousemove',function(e){x=e.clientX;y=e.clientY;
      co.textContent='['+String(Math.round(x)).padStart(3,'0')+', '+String(Math.round(y)).padStart(3,'0')+']';});
    (function loop(){cx+=(x-cx)*0.28;cy+=(y-cy)*0.28;cur.style.transform='translate('+cx+'px,'+cy+'px)';requestAnimationFrame(loop);})();
    document.addEventListener('mouseover',function(e){if(e.target.closest('a,button'))cur.classList.add('grow');});
    document.addEventListener('mouseout',function(e){if(e.target.closest('a,button'))cur.classList.remove('grow');});
    document.addEventListener('mouseleave',function(){cur.style.opacity='0';});
    document.addEventListener('mouseenter',function(){cur.style.opacity='1';});
  });
})();
