/* Hubros · componentes interativos do blog (JS puro, sem biblioteca).
   Cada componente se acha pelo atributo data-hb e só mexe dentro dele. Pode rodar mais de uma vez sem duplicar. */
(function(){
  var brl=function(v){return 'R$ '+Math.round(v).toLocaleString('pt-BR');};
  var int=function(v){return Math.round(v).toLocaleString('pt-BR');};
  var num=function(el){var v=parseFloat(String(el.value).replace(',','.'));return isNaN(v)?0:v;};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Conta o número até o valor novo (easeOutCubic, ~450ms). Primeira chamada escreve direto. */
  function tween(el,to,fmt){
    var from=el._hbv;el._hbv=to;
    if(reduce||from==null||from===to){el.textContent=fmt(to);return;}
    cancelAnimationFrame(el._hbr);var t0=performance.now();
    (function f(t){var k=Math.min((t-t0)/450,1),e=1-Math.pow(1-k,3);el.textContent=fmt(from+(to-from)*e);if(k<1)el._hbr=requestAnimationFrame(f);})(t0);
  }
  /* Pulso curto no cartão de destaque quando o resultado muda. */
  function bump(el){if(reduce||!el)return;el.classList.remove('hb-bump');void el.offsetWidth;el.classList.add('hb-bump');}

  /* 1 · Calculadora da hora vazia (blog 1) */
  function calc(root){
    if(root.dataset.hbReady)return;root.dataset.hbReady=1;
    var q=function(s){return root.querySelector(s)};
    var disp=q('[name=disp]'),uso=q('[name=uso]'),preco=q('[name=preco]'),custo=q('[name=custo]');
    function run(){
      var d=Math.max(num(disp),0),u=Math.min(Math.max(num(uso),0),d),p=Math.max(num(preco),0),c=Math.max(num(custo),0);
      var vaz=d-u,occ=d>0?u/d:0,sem=vaz*p,mes=sem*4;
      tween(q('[data-o=occ]'),occ*100,function(v){return Math.round(v)+'%'});
      tween(q('[data-o=vaz]'),vaz,function(v){return int(v)+' h'});
      tween(q('[data-o=sem]'),sem,brl);
      var m=q('[data-o=mes]');if(m._hbv!=null&&m._hbv!==mes)bump(m.parentNode);
      tween(m,mes,brl);
      q('[data-o=bar]').style.width=(occ*100).toFixed(1)+'%';
      var ch=q('[data-o=ch]');
      ch.textContent=(c>0&&d>0)?('Cada hora disponível custa '+brl(c/(d*4))+' pra você, com ou sem cliente.'):'Preencha o custo mensal da sala pra ver quanto custa cada hora disponível.';
    }
    [disp,uso,preco,custo].forEach(function(i){i.addEventListener('input',run)});
    /* Botões − / + no lugar das setinhas nativas. */
    var STEP={disp:1,uso:1,preco:5,custo:100};
    [disp,uso,preco,custo].forEach(function(i){
      var box=document.createElement('span');box.className='hb-steps';
      [['−',-1,'Diminuir'],['+',1,'Aumentar']].forEach(function(d){
        var b=document.createElement('button');b.type='button';b.textContent=d[0];b.setAttribute('aria-label',d[2]+' '+(i.labels&&i.labels[0]?i.labels[0].textContent.toLowerCase():''));
        b.addEventListener('click',function(){i.value=Math.max(0,num(i)+d[1]*STEP[i.name]);i.dispatchEvent(new Event('input',{bubbles:true}));});
        box.appendChild(b);
      });
      i.parentNode.appendChild(box);
      /* Input do tamanho do número, pra a unidade ("h") ficar colada nele. */
      var fit=function(){i.style.width=(Math.max(String(i.value||i.placeholder||'').length,1)+0.6)+'ch'};
      i.addEventListener('input',fit);fit();
    });
    run();
  }

  /* 2 · Funil dos psicólogos com premissas ajustáveis (blog 2) */
  function funil(root){
    if(root.dataset.hbReady)return;root.dataset.hbReady=1;
    var BASE=177969,AUT=0.781;
    var P={baixo:{ativos:70,capital:26,presencial:50,semespaco:30,horas:6},alto:{ativos:85,capital:35,presencial:70,semespaco:50,horas:15}};
    var keys=['ativos','capital','presencial','semespaco','horas'];
    var sl={};keys.forEach(function(k){sl[k]=root.querySelector('input[name='+k+']')});
    var btns=root.querySelectorAll('[data-preset]');
    function set(name){keys.forEach(function(k){sl[k].value=P[name][k]});btns.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.preset===name)});run();}
    function run(){
      var v={};keys.forEach(function(k){v[k]=num(sl[k])});
      var s=[BASE,BASE*v.ativos/100];s.push(s[1]*v.capital/100);s.push(s[2]*AUT);s.push(s[3]*v.presencial/100);s.push(s[4]*v.semespaco/100);
      root.querySelectorAll('[data-pct]').forEach(function(el){var k=el.dataset.pct;el.textContent=(k==='horas'?v[k]+' h/semana':v[k]+'%')});
      root.querySelectorAll('[data-step]').forEach(function(el){var i=+el.dataset.step;tween(el,s[i],function(v){return int(v)+' psicólogos'})});
      keys.forEach(function(k){var e=sl[k],mn=+e.min,mx=+e.max;e.style.setProperty('--p',((num(e)-mn)/(mx-mn)*100)+'%')});
      root.querySelectorAll('[data-w]').forEach(function(el){var i=+el.dataset.w;el.style.width=Math.max(s[i]/BASE*100,0.6).toFixed(2)+'%'});
      var cons=Math.round(s[5])*v.horas/60;
      var c=root.querySelector('[data-o=cons]');if(c._hbv!=null&&c._hbv!==cons)bump(c.parentNode);
      tween(root.querySelector('[data-o=prof]'),s[5],int);
      tween(c,cons,int);
    }
    keys.forEach(function(k){sl[k].addEventListener('input',function(){btns.forEach(function(b){b.setAttribute('aria-pressed','false')});run();})});
    btns.forEach(function(b){b.addEventListener('click',function(){set(b.dataset.preset)})});
    set('baixo');
  }

  /* 3 · Checklist da sala (blog 2) */
  function check(root){
    if(root.dataset.hbReady)return;root.dataset.hbReady=1;
    var boxes=root.querySelectorAll('input[type=checkbox]'),out=root.querySelector('.hb-score');
    var prog=document.createElement('div');prog.className='hb-prog';prog.setAttribute('aria-hidden','true');prog.appendChild(document.createElement('span'));
    out.parentNode.insertBefore(prog,out);
    function run(){var n=0;boxes.forEach(function(b){if(b.checked)n++});
      prog.firstChild.style.width=(n/boxes.length*100)+'%';prog.classList.toggle('ok',n===boxes.length);
      out.textContent=n===boxes.length?'Tudo certo. Sua sala está pronta pra ser anunciada pra saúde.':(n+' de '+boxes.length+' itens. Vale resolver o resto antes de anunciar.');}
    boxes.forEach(function(b){b.addEventListener('change',run)});run();
  }

  /* Entrada ao rolar: blocos abaixo da dobra começam recolhidos e aparecem ao entrar na tela.
     Desligado com movimento reduzido e no prerender (navigator.webdriver), pra o HTML estático sair completo. */
  var io=null;
  function reveal(){
    document.querySelectorAll('.hb').forEach(function(box){
      ['.hb-week .c.on','[style*="height:100%"]','.hb-chart rect','.hb-card'].forEach(function(sel){
        box.querySelectorAll(sel).forEach(function(el,i){el.style.setProperty('--i',i)});
      });
    });
    if(reduce||navigator.webdriver||!('IntersectionObserver' in window))return;
    io=io||new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('hb-pre');io.unobserve(e.target);}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
    /* Rede de segurança: rolagem muito rápida pode pular o observer; tudo que já passou do fim da tela aparece. */
    if(!reveal.bound){reveal.bound=1;window.addEventListener('scroll',function(){
      document.querySelectorAll('.hb.hb-pre').forEach(function(el){if(el.getBoundingClientRect().top<innerHeight){el.classList.remove('hb-pre');io.unobserve(el);}});
    },{passive:true});}
    document.querySelectorAll('.hb').forEach(function(el){
      if(el.dataset.hbSeen)return;el.dataset.hbSeen=1;
      if(el.getBoundingClientRect().top<innerHeight*0.88)return;
      el.classList.add('hb-pre');io.observe(el);
    });
  }

  function init(){
    reveal();
    document.querySelectorAll('[data-hb=calc]').forEach(calc);
    document.querySelectorAll('[data-hb=funil]').forEach(funil);
    document.querySelectorAll('[data-hb=check]').forEach(check);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.hubrosBlogInit=init;
})();
