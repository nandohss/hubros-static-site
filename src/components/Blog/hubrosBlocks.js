/* Hubros · componentes interativos do blog (JS puro, sem biblioteca).
   Cada componente se acha pelo atributo data-hb e só mexe dentro dele. Pode rodar mais de uma vez sem duplicar. */
(function(){
  var brl=function(v){return 'R$ '+Math.round(v).toLocaleString('pt-BR');};
  var int=function(v){return Math.round(v).toLocaleString('pt-BR');};
  var num=function(el){var v=parseFloat(String(el.value).replace(',','.'));return isNaN(v)?0:v;};

  /* 1 · Calculadora da hora vazia (blog 1) */
  function calc(root){
    if(root.dataset.hbReady)return;root.dataset.hbReady=1;
    var q=function(s){return root.querySelector(s)};
    var disp=q('[name=disp]'),uso=q('[name=uso]'),preco=q('[name=preco]'),custo=q('[name=custo]');
    function run(){
      var d=Math.max(num(disp),0),u=Math.min(Math.max(num(uso),0),d),p=Math.max(num(preco),0),c=Math.max(num(custo),0);
      var vaz=d-u,occ=d>0?u/d:0,sem=vaz*p,mes=sem*4;
      q('[data-o=occ]').textContent=Math.round(occ*100)+'%';
      q('[data-o=vaz]').textContent=int(vaz)+' h';
      q('[data-o=sem]').textContent=brl(sem);
      q('[data-o=mes]').textContent=brl(mes);
      q('[data-o=bar]').style.width=(occ*100).toFixed(1)+'%';
      var ch=q('[data-o=ch]');
      ch.textContent=(c>0&&d>0)?('Cada hora disponível custa '+brl(c/(d*4))+' pra você, com ou sem cliente.'):'Preencha o custo mensal da sala pra ver quanto custa cada hora disponível.';
    }
    [disp,uso,preco,custo].forEach(function(i){i.addEventListener('input',run)});
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
      root.querySelectorAll('[data-step]').forEach(function(el){var i=+el.dataset.step;el.textContent=int(s[i])+' psicólogos'});
      root.querySelectorAll('[data-w]').forEach(function(el){var i=+el.dataset.w;el.style.width=Math.max(s[i]/BASE*100,0.6).toFixed(2)+'%'});
      var cons=Math.round(s[5])*v.horas/60;
      root.querySelector('[data-o=prof]').textContent=int(s[5]);
      root.querySelector('[data-o=cons]').textContent=int(cons);
    }
    keys.forEach(function(k){sl[k].addEventListener('input',function(){btns.forEach(function(b){b.setAttribute('aria-pressed','false')});run();})});
    btns.forEach(function(b){b.addEventListener('click',function(){set(b.dataset.preset)})});
    set('baixo');
  }

  /* 3 · Checklist da sala (blog 2) */
  function check(root){
    if(root.dataset.hbReady)return;root.dataset.hbReady=1;
    var boxes=root.querySelectorAll('input[type=checkbox]'),out=root.querySelector('.hb-score');
    function run(){var n=0;boxes.forEach(function(b){if(b.checked)n++});
      out.textContent=n===boxes.length?'Tudo certo. Sua sala está pronta pra ser anunciada pra saúde.':(n+' de '+boxes.length+' itens. Vale resolver o resto antes de anunciar.');}
    boxes.forEach(function(b){b.addEventListener('change',run)});run();
  }

  function init(){
    document.querySelectorAll('[data-hb=calc]').forEach(calc);
    document.querySelectorAll('[data-hb=funil]').forEach(funil);
    document.querySelectorAll('[data-hb=check]').forEach(check);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.hubrosBlogInit=init;
})();
