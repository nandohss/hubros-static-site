#!/usr/bin/env python3
"""
Aplica ajustes na landing /espacos/ e regenera a cópia publicada.

O HTML real vive como STRING JSON dentro de <script type="__bundler/template">.
Regras que NÃO podem ser quebradas (ver memória project_landing_espacos):
  - extrair com raw_decode, nunca com regex `(.*?)</script>` (há <script> aninhado)
  - ao reencodar, escapar TODO `</script>` para `<\\/script>`, senão o parser HTML
    do navegador fecha a tag no meio do JSON e o unpacking quebra em produção
"""
import json
import shutil
import sys

SRC = 'landing_page_espacos.html'
PUB = 'public/espacos/index.html'
MARKER = '<script type="__bundler/template">'


def read_template(h):
    start = h.find(MARKER) + len(MARKER)
    tpl, end = json.JSONDecoder().raw_decode(h, start)
    assert h[end:end + 9] == '</script>', 'delimitador inesperado apos a string JSON'
    return tpl, start, end


def write_template(h, start, end, tpl):
    encoded = json.dumps(tpl)
    # crítico: barra de fechamento escapada para o parser HTML não truncar
    encoded = encoded.replace('</script>', '<\\/script>')
    assert '</script>' not in encoded, 'sobrou </script> cru no JSON'
    return h[:start] + encoded + h[end:]


def sub1(text, old, new, label):
    n = text.count(old)
    assert n == 1, f'[{label}] esperava 1 ocorrencia, achei {n}'
    return text.replace(old, new, 1)


# ---------------------------------------------------------------- CSS/JS novos

ANIM_CSS = """
  /* ===== Fundo do canvas =====
     O rodapé é escuro e é o último bloco da página. Sem isto, o "overscroll"
     (efeito elástico do iOS) revela o branco do body embaixo do rodapé. */
  html { background: #0B0B0C; }

  /* ===== overflow-x: clip, NUNCA hidden =====
     `hidden` faz o navegador computar overflow-y:auto e transformar o body em
     container de rolagem (altura travada na viewport). Isso quebra o
     position:sticky do header E impede o IntersectionObserver de disparar nos
     blocos abaixo da dobra. `clip` corta o transbordo sem criar o container. */
  html, body { overflow-x: clip; }

  /* ===== Microinterações e animações de rolagem =====
     O estado inicial invisível só entra quando o JS confirma suporte e marca
     .esp-anim no <html>. Sem JS o conteúdo aparece normalmente — a página é
     indexável e não pode depender de JS para exibir texto. */
  .esp-anim .esp-reveal { opacity: 0; transform: translateY(22px); }
  .esp-anim .esp-reveal.esp-in {
    opacity: 1; transform: none;
    transition: opacity .6s cubic-bezier(.22,.75,.28,1), transform .6s cubic-bezier(.22,.75,.28,1);
  }

  /* tabular-nums + min-width (setado no JS) evitam o número "pular" ao contar */
  .esp-count { font-variant-numeric: tabular-nums; }

  /* hover só onde existe mouse de verdade — evita estado "grudado" no toque.
     O template usa um atributo style-hover que não existe em HTML, então
     nenhum hover funcionava antes disto. */
  @media (hover: hover) and (pointer: fine) {
    .esp-card { transition: transform .28s ease, box-shadow .28s ease; }
    .esp-card:hover { transform: translateY(-4px); box-shadow: 0 16px 36px rgba(11,11,12,.10); }
    .esp-cta { transition: transform .2s ease, box-shadow .2s ease; }
    .esp-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(11,11,12,.24); }
    .esp-link { transition: color .2s ease; }
    .esp-link:hover { color: #0B0B0C; }
    footer .esp-link:hover { color: #F7F7F8; }
  }
  .esp-cta:active { transform: translateY(0); }

  header { transition: box-shadow .3s ease; }
  header.esp-stuck { box-shadow: 0 6px 22px rgba(11,11,12,.07); }

  /* Bolinha do badge "Lançamento": pulso sutil de "ao vivo", não um piscar
     chamativo — a cor não muda, só um halo que expande e some, como o ponto
     de gravação de apps de câmera. */
  .esp-pulse-dot { position: relative; }
  .esp-pulse-dot::after {
    content: ''; position: absolute; inset: 0; border-radius: 9999px;
    background: #D6BB87; opacity: .55;
    animation: esp-pulse 1.8s cubic-bezier(.22,.75,.28,1) infinite;
  }
  @keyframes esp-pulse {
    0%   { transform: scale(1);   opacity: .55; }
    70%  { transform: scale(2.6); opacity: 0; }
    100% { transform: scale(2.6); opacity: 0; }
  }

  /* ===== Mockup iPhone 17 =====
     CSS puro: a landing é standalone (bundle self-contained), então não dá
     pra reusar o IPhone3D/three.js do site principal. As proporções vêm de lá:
     tela 0.4613 (19.5:9 → 288x624) e moldura = tela + ~2,7% por lado (8px),
     mesma relação do `bodyW = screenW + 0.16` do componente 3D.
     O screenshot não tem status bar, então a tela reserva 38px no topo pra
     ela + Dynamic Island — e com isso a imagem (aspect 0.4931) encaixa nos
     288px de largura sem corte lateral. */
  .esp-iphone {
    position: relative;
    /* border-box explícito: o reset `* { box-sizing: border-box }` vive no
       shell externo e NÃO sobrevive ao replaceWith do bundler. Sem isto a
       largura vira 304+16=320 e a moldura fica grossa demais. */
    box-sizing: border-box;
    width: 304px;
    padding: 8px;
    border-radius: 48px;
    /* alumínio do iPhone 17: faixas claras/escuras simulam o chanfro */
    background: linear-gradient(160deg,#e8e8ec 0%,#a9a9af 16%,#f4f4f7 32%,#9c9ca2 50%,#eaeaee 68%,#a3a3a9 84%,#dfdfe3 100%);
    box-shadow: 0 30px 70px rgba(11,11,12,.22), 0 2px 10px rgba(11,11,12,.14);
  }
  .esp-iphone__screen {
    position: relative;
    width: 288px; height: 624px;
    border-radius: 40px;
    overflow: hidden;
    background: #FFFFFF;
    display: flex; flex-direction: column;
    box-shadow: inset 0 0 0 1px rgba(11,11,12,.06);
  }
  .esp-iphone__status {
    position: relative;
    flex: 0 0 38px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px 0 22px;
    font-size: 12px; font-weight: 600; color: #0B0B0C;
    letter-spacing: .01em;
  }
  .esp-iphone__island {
    position: absolute; top: 7px; left: 50%; transform: translateX(-50%);
    width: 92px; height: 26px; border-radius: 9999px; background: #000;
  }
  /* min-height:0 deixa o flex encolher a imagem; object-fit corta pelo rodapé
     em vez de espremer o layout do app */
  .esp-iphone__shot {
    flex: 1 1 auto; min-height: 0;
    width: 100%; object-fit: cover; object-position: top center;
    display: block;
  }
  .esp-iphone__btn {
    position: absolute; width: 3px; border-radius: 2px;
    background: linear-gradient(180deg,#bcbcc2,#8e8e94);
  }
  .esp-iphone__btn--action { left: -2px;  top: 116px; height: 26px; }
  .esp-iphone__btn--volup  { left: -2px;  top: 158px; height: 48px; }
  .esp-iphone__btn--voldn  { left: -2px;  top: 218px; height: 48px; }
  .esp-iphone__btn--power  { right: -2px; top: 176px; height: 70px; }
  .esp-iphone__btn--cam    { right: -2px; top: 262px; height: 34px; }

  /* acessibilidade: quem pediu menos movimento não recebe animação nenhuma */
  @media (prefers-reduced-motion: reduce) {
    .esp-anim .esp-reveal { opacity: 1 !important; transform: none !important; }
    .esp-reveal, .esp-card, .esp-cta, .esp-link, header { transition: none !important; }
    .esp-pulse-dot::after { animation: none; display: none; }
  }
"""

# IMPORTANTE: este script precisa ser RE-ENTRANTE.
# O bundler troca os nós do DOM DEPOIS que os scripts do template executam
# (verificado: o <header> capturado na 1a passada sai do documento). As classes
# sobrevivem porque são atributos clonados, mas IntersectionObserver e
# addEventListener ficam presos em nós mortos e nunca disparam. Por isso o
# script se reinicializa sempre que o nó de referência sai do documento.
ANIM_JS = """
<script>
(function () {
  var STATE = window.__esp = window.__esp || {};

  function tagAll(sel, cls) {
    var els = document.querySelectorAll(sel);
    for (var i = 0; i < els.length; i++) { els[i].classList.add(cls); }
  }

  function liveHeader() {
    if (!STATE.header || !document.contains(STATE.header)) {
      STATE.header = document.querySelector('header');
    }
    return STATE.header;
  }

  // Duas coisas ficam brancas por padrão perto do rodapé preto, e as duas
  // precisam de cor DINÂMICA (a página tem trechos claros e escuros — uma cor
  // fixa erra em algum trecho, não tem como acertar as duas pontas com CSS
  // estático):
  //  1) a barra de endereço/toolbar do Safari — segue <meta theme-color>
  //  2) o "canvas" por trás do conteúdo, exposto no rubber-band bounce do iOS
  //     (arrastar além do topo/fim da página) — é o background computado de
  //     <html>/<body>, e mesmo com html{background:#0B0B0C} fixo, o body
  //     shipa com background:#FFFFFF do CSS original e o bounce mostra branco.
  //     Setar o style inline do <html> tem especificidade maior que a regra
  //     de classe e cobre os dois casos.
  function updateEdgeColors() {
    var darkSections = document.querySelectorAll('.esp-dark-zone, footer');
    var probeY = window.innerHeight - 4; // faixa que a toolbar do Safari cobre
    var dark = false;
    for (var i = 0; i < darkSections.length; i++) {
      var r = darkSections[i].getBoundingClientRect();
      if (r.top <= probeY && r.bottom >= 0) { dark = true; break; }
    }
    var color = dark ? '#0B0B0C' : '#FFFFFF';

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta && meta.getAttribute('content') !== color) { meta.setAttribute('content', color); }

    // html E body: não dá pra saber de qual dos dois o WebKit tira a cor do
    // bounce nesta página (tem <x-dc> envolvendo tudo, fora do padrão), então
    // os dois recebem o mesmo valor via style inline (specificidade máxima).
    if (document.documentElement.style.backgroundColor !== color) {
      document.documentElement.style.backgroundColor = color;
    }
    if (document.body && document.body.style.backgroundColor !== color) {
      document.body.style.backgroundColor = color;
    }
  }

  // O listener fica no window (que sobrevive à troca de nós); o header é
  // re-consultado a cada disparo, então nunca aponta para um nó morto.
  function bindScrollOnce() {
    if (STATE.scrollBound) { return; }
    STATE.scrollBound = true;
    var onScroll = function () {
      var h = liveHeader();
      if (h) {
        if (window.scrollY > 8) { h.classList.add('esp-stuck'); }
        else { h.classList.remove('esp-stuck'); }
      }
      updateEdgeColors();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    STATE.onScroll = onScroll;
  }

  function collectTargets() {
    var targets = [];
    var sections = document.querySelectorAll('section');
    for (var s = 0; s < sections.length; s++) {
      var sec = sections[s];
      var style = sec.getAttribute('style') || '';
      var container = style.indexOf('max-width') !== -1 ? sec : sec.querySelector(':scope > div');
      if (!container) { continue; }
      for (var c = 0; c < container.children.length; c++) {
        var child = container.children[c];
        var display = window.getComputedStyle(child).display;
        if (display === 'grid' && child.children.length > 1) {
          for (var g = 0; g < child.children.length; g++) { targets.push([child.children[g], g]); }
        } else {
          targets.push([child, 0]);
        }
      }
    }
    return targets;
  }

  function initReveal() {
    var targets = collectTargets();
    if (!targets.length) { return; }
    document.documentElement.classList.add('esp-anim');

    if (STATE.io) { STATE.io.disconnect(); }
    STATE.io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) { continue; }
        var el = entries[i].target;
        el.style.transitionDelay = (el.getAttribute('data-esp-delay') || 0) + 'ms';
        el.classList.add('esp-in');
        STATE.io.unobserve(el);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    for (var t = 0; t < targets.length; t++) {
      var el = targets[t][0];
      el.classList.add('esp-reveal');
      el.setAttribute('data-esp-delay', Math.min(targets[t][1], 5) * 80);
      STATE.io.observe(el);
    }
  }

  function initCounters() {
    var nums = [];
    var divs = document.querySelectorAll('div');
    for (var d = 0; d < divs.length; d++) {
      var el = divs[d];
      if (el.children.length || el.getAttribute('data-esp-counted')) { continue; }
      if (/^\\d{1,3}%$/.test((el.textContent || '').trim())) { nums.push(el); }
    }
    if (!nums.length) { return; }

    if (STATE.countIO) { STATE.countIO.disconnect(); }
    STATE.countIO = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) { continue; }
        var node = entries[i].target;
        STATE.countIO.unobserve(node);
        if (node.getAttribute('data-esp-counted')) { continue; }
        var to = parseInt((node.textContent || '').trim(), 10);
        if (isNaN(to)) { continue; }
        node.setAttribute('data-esp-counted', '1');
        // trava a largura antes de zerar, senão o texto "pula" enquanto conta
        node.style.minWidth = Math.ceil(node.getBoundingClientRect().width) + 'px';
        node.classList.add('esp-count');
        (function (n, target) {
          var startTs = null, dur = 1000;
          function step(ts) {
            if (startTs === null) { startTs = ts; }
            var p = Math.min((ts - startTs) / dur, 1);
            n.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + '%';
            if (p < 1) { requestAnimationFrame(step); }
          }
          requestAnimationFrame(step);
        })(node, to);
      }
    }, { threshold: 0.6 });

    for (var n2 = 0; n2 < nums.length; n2++) { STATE.countIO.observe(nums[n2]); }
  }

  // Nó representativo do DOM atual. Nunca cair para document.body: o body
  // sobrevive a qualquer troca, e usá-lo como referência desliga para sempre a
  // detecção de staleness (foi exatamente esse o bug).
  function currentAnchor() {
    return document.querySelector('header') || document.querySelector('section');
  }

  function init() {
    var anchor = currentAnchor();
    if (!anchor) { return; }  // DOM ainda não montado; a próxima tentativa pega

    tagAll('a[href*="lista-de-espera"]', 'esp-cta');
    tagAll('header a, footer a', 'esp-link');
    tagAll('[style*="border-radius:16px"], [style*="border-radius:14px"]', 'esp-card');
    bindScrollOnce();
    if (STATE.onScroll) { STATE.onScroll(); }

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && ('IntersectionObserver' in window)) {
      initReveal();
      initCounters();
    }

    // WeakSet e não atributo: quando o bundler CLONA a árvore, os atributos vêm
    // junto (um marcador em atributo daria falso positivo), mas o nó clonado é
    // outro objeto — então some do WeakSet e a reinicialização dispara.
    STATE.seen = STATE.seen || new WeakSet();
    STATE.seen.add(anchor);
  }

  function initIfStale() {
    var anchor = currentAnchor();
    if (!anchor) { return; }
    if (STATE.seen && STATE.seen.has(anchor)) { return; }
    init();
  }

  init();
  if (document.readyState !== 'complete') { window.addEventListener('load', initIfStale); }
  setTimeout(initIfStale, 150);
  setTimeout(initIfStale, 600);
  setTimeout(initIfStale, 1500);
})();
</script>
"""

# ---------------------------------------------------------------- shell externo

def patch_shell(h):
    # 1) fundo da tela de carregamento: preto -> branco (igual à página final)
    h = sub1(h,
             'body { background: #0B0B0C; display: flex;',
             'body { background: #FFFFFF; display: flex;',
             'shell body bg')

    # 2) o badge "Unpacking..." é debug e não deve aparecer para visitante
    h = sub1(h,
             '#__bundler_loading { position: fixed;',
             '#__bundler_loading { display: none; position: fixed;',
             'shell loading badge')

    # 3) fundo do placeholder de boot + spinner discreto na cor da marca
    h = sub1(h,
             '#__bundler_thumbnail { position: fixed; inset: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #0B0B0C; z-index: 9999; }',
             '#__bundler_thumbnail { position: fixed; inset: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #FFFFFF; z-index: 9999; }\n'
             '    .esp-boot { width: 30px; height: 30px; border-radius: 50%; border: 2px solid rgba(11,11,12,0.12); border-top-color: #B08F52; animation: esp-boot-spin .8s linear infinite; }\n'
             '    @keyframes esp-boot-spin { to { transform: rotate(360deg); } }\n'
             '    @media (prefers-reduced-motion: reduce) { .esp-boot { animation: none; } }',
             'shell thumbnail bg')

    # 4) troca o "logotipo" genérico dourado sobre preto pelo spinner
    start = h.find('<div id="__bundler_thumbnail">')
    end = h.find('</div>', h.find('</svg>', start)) + len('</div>')
    assert start != -1 and end > start, 'nao localizei o bloco do thumbnail'
    return h[:start] + '<div id="__bundler_thumbnail"><div class="esp-boot" aria-hidden="true"></div></div>' + h[end:]


# ------------------------------------------------------- copy do split/carteira
# O texto antigo dizia "cada coworking tem a própria carteira na Stone" e
# "repasse mensal". Isso confunde dois modelos diferentes e contradiz o backend:
#  - não é uma conta Stone que o host abre: é uma conta de recebimento (recipient
#    da Pagar.me v5) criada pelo marketplace no CNPJ/CPF dele, com KYC próprio
#  - o split é instantâneo (regras `split` na transação), mas o dinheiro chegar
#    ao BANCO é outro momento: transfer_settings = weekly (não mensal)
#  - a parte do cohoster é líquida: charge_processing_fee=False e liable=False,
#    ou seja, taxa de gateway e risco de chargeback ficam com a Hubros

_CHIP = ('<div style="background:#1A1A1D; border:1px solid #2B2B2F; border-radius:9999px;'
         ' padding:11px 18px; font-size:15px; color:#E6E6E8;">{}</div>')

_STEP = ('<div style="display:flex; gap:12px; align-items:center;">'
         '<div style="flex-shrink:0; width:26px; height:26px; border-radius:9999px; background:#1A1A1D;'
         ' border:1px solid #D6BB87; color:#D6BB87; font-size:13px; font-weight:700; display:flex;'
         ' align-items:center; justify-content:center;">{n}</div>'
         '<div style="font-size:16px; color:#F7F7F8; font-weight:500;">{t}</div></div>')

# Só rótulos: a página é comercial, não documentação. O detalhe operacional
# (prazo de liberação, taxa de gateway, chargeback) foi cortado a pedido.
PAYMENT_STEPS = (
    '\n        <div style="display:flex; flex-direction:column; gap:12px;">'
    + _STEP.format(n='1', t='Reserva paga no app')
    + _STEP.format(n='2', t='Sua parte cai na sua conta')
    + _STEP.format(n='3', t='Repasse automático uma vez por mês')
    + '</div>'
)


def patch_payment_copy(tpl):
    # 1) título: tira a ideia de "carteira Stone própria"
    tpl = sub1(tpl,
               'O dinheiro cai na <span style="color:#D6BB87;">sua carteira Stone</span>, não na nossa.',
               'O dinheiro é dividido <span style="color:#D6BB87;">na hora</span>. '
               'Não passa pelo nosso caixa.',
               'titulo pagamento')

    # 2) parágrafo: duas frases — de quem é a conta e quando a parte dele entra
    tpl = sub1(tpl,
               'Cada coworking tem a própria carteira na Stone. O usuário paga a reserva pelo app, a Stone processa a transação e faz o split na hora: a sua parte vai direto para a sua carteira. A Hubros não guarda, não segura e não repassa dinheiro por fora.',
               'A Stone abre uma conta de recebimento no seu CNPJ ou CPF. '
               'A cada reserva paga, a sua parte cai direto nela.',
               'paragrafo pagamento')

    # 3) passos + chips encurtados (a lista inteira de chips é substituída)
    tpl = sub1(tpl,
               '\n        <div style="display:flex; flex-wrap:wrap; gap:10px;">\n'
               '          ' + _CHIP.format('Antifraude e criptografia da Stone') + '\n'
               '          ' + _CHIP.format('Sem calote: só entra quem já pagou') + '\n'
               '          ' + _CHIP.format('Cartão e Pix no app') + '\n'
               '        </div>',
               PAYMENT_STEPS
               + '\n        <div style="display:flex; flex-wrap:wrap; gap:10px;">\n'
                 '          ' + _CHIP.format('Antifraude Stone') + '\n'
                 '          ' + _CHIP.format('Só entra quem já pagou') + '\n'
                 '          ' + _CHIP.format('Cartão e Pix') + '\n'
                 '        </div>',
               'passos + chips')

    # 4) card dos 85%
    tpl = sub1(tpl,
               'Vai direto para a sua carteira Stone, a cada reserva paga.',
               'Sua parte de cada reserva paga.',
               'descricao 85%')

    # 5) card dos 15%
    tpl = sub1(tpl,
               'Só sobre reserva concluída. Sem mensalidade, sem taxa de cadastro.',
               'Só sobre reserva concluída. Sem mensalidade.',
               'descricao 15%')

    # 6) rodapé do split
    tpl = sub1(tpl,
               'Repasse mensal para a sua conta',
               'Repasse automático uma vez por mês',
               'periodicidade do repasse')

    # 7) card 04 dos benefícios: repetia "carteira própria" e o percentual
    tpl = sub1(tpl,
               'Carteira própria na Stone: 85% de cada reserva cai direto para você, com repasse mensal.',
               'Conta de recebimento no seu nome, com repasse automático todo mês.',
               'card 04 beneficios')

    # 8) CTA final: "no ar em até 24h" é o prazo antigo do cadastro manual —
    # hoje o coworking fica disponível assim que o cadastro é concluído.
    return sub1(tpl,
                'Cadastro em 10 minutos e seu coworking no ar em até 24h.',
                'Cadastro em 10 minutos e seu coworking disponível na hora.',
                'CTA final - prazo')


# ---------------------------------------------------------------- template

_OLD_PHONE = (
    '<div style="width:288px; height:624px; border-radius:42px; overflow:hidden; background:#FFFFFF;'
    ' box-shadow:0 30px 70px rgba(11,11,12,0.18), 0 0 0 1px rgba(11,11,12,0.08); display:flex;'
    ' align-items:flex-start; justify-content:center;">\n'
    '          <img src="a591cc48-048d-4d1c-b436-180fb0a0b55d" alt="Tela do app Hubros"'
    ' style="height:100%; width:auto; display:block;">\n'
    '        </div>'
)

# Status bar desenhada em SVG (sinal, wi-fi, bateria) porque o screenshot não
# traz a barra do iOS. Horário 22:34 = o mesmo do mockup do site principal.
_NEW_PHONE = (
    '<div class="esp-iphone">\n'
    '          <div class="esp-iphone__screen">\n'
    '            <div class="esp-iphone__status">\n'
    '              <span>22:34</span>\n'
    '              <span class="esp-iphone__island" aria-hidden="true"></span>\n'
    '              <svg width="46" height="12" viewBox="0 0 46 12" fill="#0B0B0C" aria-hidden="true">\n'
    '                <rect x="0" y="7" width="3" height="5" rx="1"></rect>\n'
    '                <rect x="5" y="5" width="3" height="7" rx="1"></rect>\n'
    '                <rect x="10" y="3" width="3" height="9" rx="1"></rect>\n'
    '                <rect x="15" y="1" width="3" height="11" rx="1"></rect>\n'
    '                <path d="M26.4 4.7a7 7 0 0 1 8.2 0" fill="none" stroke="#0B0B0C" stroke-width="1.5" stroke-linecap="round"></path>\n'
    '                <path d="M28.4 7.2a4.2 4.2 0 0 1 4.2 0" fill="none" stroke="#0B0B0C" stroke-width="1.5" stroke-linecap="round"></path>\n'
    '                <circle cx="30.5" cy="9.8" r="1.1"></circle>\n'
    '                <rect x="37" y="2.2" width="7.6" height="7.6" rx="2.2" fill="none" stroke="#0B0B0C" stroke-width="1" opacity=".4"></rect>\n'
    '                <rect x="38.2" y="3.4" width="5.2" height="5.2" rx="1.2"></rect>\n'
    '                <rect x="45.2" y="4.6" width="0.9" height="2.8" rx="0.45" opacity=".4"></rect>\n'
    '              </svg>\n'
    '            </div>\n'
    '            <img class="esp-iphone__shot" src="a591cc48-048d-4d1c-b436-180fb0a0b55d" alt="Tela do app Hubros">\n'
    '          </div>\n'
    '          <span class="esp-iphone__btn esp-iphone__btn--action" aria-hidden="true"></span>\n'
    '          <span class="esp-iphone__btn esp-iphone__btn--volup" aria-hidden="true"></span>\n'
    '          <span class="esp-iphone__btn esp-iphone__btn--voldn" aria-hidden="true"></span>\n'
    '          <span class="esp-iphone__btn esp-iphone__btn--power" aria-hidden="true"></span>\n'
    '          <span class="esp-iphone__btn esp-iphone__btn--cam" aria-hidden="true"></span>\n'
    '        </div>'
)


def patch_template(tpl):
    # Moldura de iPhone 17 em volta do screenshot do app
    tpl = sub1(tpl, _OLD_PHONE, _NEW_PHONE, 'mockup iPhone 17')

    # Marca a seção de pagamento (fundo #0B0B0C) para o script de theme-color
    # achar por classe. Não dá pra caçar por texto do atributo style: uma vez
    # no DOM o browser normaliza o hex pra `rgb(11, 11, 12)`, quebrando
    # qualquer seletor `[style*="#0B0B0C"]`.
    tpl = sub1(tpl,
               '<section style="background:#0B0B0C; color:#F7F7F8;">',
               '<section class="esp-dark-zone" style="background:#0B0B0C; color:#F7F7F8;">',
               'marca secao de pagamento')

    # Bolinha do badge "Lançamento" pulsando (::after herda a cor/tamanho via
    # position:relative no próprio elemento, ver ANIM_CSS)
    tpl = sub1(tpl,
               '<span style="width:8px; height:8px; border-radius:9999px; background:#D6BB87; display:block;"></span>',
               '<span class="esp-pulse-dot" style="width:8px; height:8px; border-radius:9999px; background:#D6BB87; display:block;"></span>',
               'bolinha pulsando do badge')

    # Fernando: "plataforma" -> "Plataforma" (consistência com o cargo do Gabriel)
    tpl = sub1(tpl,
               'CTO — plataforma e experiência do app',
               'CTO — Plataforma e experiência do app',
               'cargo Fernando')

    # CSS novo. Tira o overflow-x:hidden daqui — volta como `clip` no ANIM_CSS.
    tpl = sub1(tpl,
               '  body { margin: 0; background: #FFFFFF; overflow-x: hidden; }',
               '  body { margin: 0; background: #FFFFFF; }\n' + ANIM_CSS,
               'bloco de CSS de animacao')

    tpl = patch_payment_copy(tpl)

    # JS no fim do wrapper
    return sub1(tpl, '</div>\n</x-dc>', ANIM_JS + '</div>\n</x-dc>', 'script de animacao')


# ---------------------------------------------------------------- SEO

TITLE = 'Cadastre seu coworking na Hubros — horas vazias viram receita'
DESC = ('A Hubros conecta profissionais que precisam de um lugar para trabalhar aos '
        'espaços que estão ociosos. Cadastro gratuito, você define preço e horário, '
        'e o pagamento cai direto na sua carteira.')
OG_DESC = 'Suas horas ociosas viram receita. Cadastro gratuito, sem mensalidade.'
URL = 'https://hubros.com.br/espacos/'


def apply_seo(path):
    """O bundle apaga o <head> original ao trocar o documento, então os metadados
    precisam entrar nos DOIS heads: o do shell externo (o que um crawler sem JS
    lê) e o do template interno (o que fica valendo depois do unpacking)."""
    h = open(path, encoding='utf8').read()

    # 1) head do template interno — dentro da string JSON, aspas escapadas.
    # theme-color TEM que estar aqui também: o bundler troca o <html> inteiro
    # (replaceWith), então a meta tag do shell externo não sobrevive ao unpack
    # — sem ela aqui, o script que ajusta a cor dinamicamente (ver ANIM_JS)
    # não encontra o elemento pra atualizar.
    inner = (
        f'<title>{TITLE}</title>\\n'
        f'<meta name=\\"description\\" content=\\"{DESC}\\">\\n'
        f'<link rel=\\"canonical\\" href=\\"{URL}\\">\\n'
        '<link rel=\\"icon\\" href=\\"/favicon.png\\">\\n'
        '<meta name=\\"theme-color\\" content=\\"#FFFFFF\\">\\n'
        '<meta property=\\"og:type\\" content=\\"website\\">\\n'
        '<meta property=\\"og:site_name\\" content=\\"Hubros\\">\\n'
        '<meta property=\\"og:locale\\" content=\\"pt_BR\\">\\n'
        f'<meta property=\\"og:url\\" content=\\"{URL}\\">\\n'
        '<meta property=\\"og:title\\" content=\\"Cadastre seu coworking na Hubros\\">\\n'
        f'<meta property=\\"og:description\\" content=\\"{OG_DESC}\\">\\n'
        '<meta property=\\"og:image\\" content=\\"https://hubros.com.br/favicon.png\\">\\n'
    )
    h = sub1(h,
             '<html><head>\\n<meta charset=\\"utf-8\\">',
             '<html lang=\\"pt-BR\\"><head>\\n' + inner + '<meta charset=\\"utf-8\\">',
             'SEO head do template')

    # 2) head do shell externo
    outer = (
        '<html lang="pt-BR">\n<head>\n  <meta charset="utf-8">\n'
        f'  <title>{TITLE}</title>\n'
        f'  <meta name="description" content="{DESC}">\n'
        f'  <link rel="canonical" href="{URL}">\n'
        '  <link rel="icon" href="/favicon.png">\n'
        '  <meta name="theme-color" content="#FFFFFF">\n'
        '  <meta property="og:type" content="website">\n'
        '  <meta property="og:site_name" content="Hubros">\n'
        '  <meta property="og:locale" content="pt_BR">\n'
        f'  <meta property="og:url" content="{URL}">\n'
        '  <meta property="og:title" content="Cadastre seu coworking na Hubros">\n'
        f'  <meta property="og:description" content="{OG_DESC}">\n'
        '  <meta property="og:image" content="https://hubros.com.br/favicon.png">'
    )
    h = sub1(h,
             '<html>\n<head>\n  <meta charset="utf-8">\n  <title>Bundled Page</title>',
             outer,
             'SEO head do shell')

    open(path, 'w', encoding='utf8').write(h)
    assert 'Bundled Page' not in open(path, encoding='utf8').read()


def main():
    h = open(SRC, encoding='utf8').read()
    before = len(h)

    h = patch_shell(h)
    tpl, start, end = read_template(h)
    tpl = patch_template(tpl)
    h = write_template(h, start, end, tpl)

    open(SRC, 'w', encoding='utf8').write(h)
    print(f'{SRC}: {before} -> {len(h)} bytes')

    # verificação de integridade no arquivo final
    tpl2, _, _ = read_template(open(SRC, encoding='utf8').read())
    assert 'CTO — Plataforma' in tpl2
    assert 'esp-reveal' in tpl2 and 'initIfStale' in tpl2
    assert 'overflow-x: hidden' not in tpl2, 'overflow-x:hidden quebra sticky + IntersectionObserver'
    assert 'overflow-x: clip' in tpl2
    # o texto antigo confundia subconta com carteira Stone própria
    assert 'carteira Stone' not in tpl2 and 'Carteira própria' not in tpl2
    assert 'Repasse automático uma vez por mês' in tpl2
    assert 'chargeback' not in tpl2 and 'taxa de processamento' not in tpl2.lower()
    # o percentual deve aparecer só nos cards do split, não no card 04
    assert tpl2.count('85%') == 1, 'o 85% deve ficar só no card do split'
    assert '15%' in tpl2, 'split anunciado deve bater com HUBROS_FEE_PERCENT=15'
    assert 'no ar em até 24h' not in tpl2
    assert 'disponível na hora' in tpl2
    assert 'updateEdgeColors' in tpl2
    assert 'esp-pulse-dot' in tpl2 and '@keyframes esp-pulse' in tpl2
    assert 'esp-iphone__island' in tpl2 and 'esp-iphone__shot' in tpl2
    assert 'border-radius:42px' not in tpl2, 'moldura antiga do telefone ficou pra tras'
    print('   integridade OK: JSON valido, delimitador correto, patches presentes')

    shutil.copyfile(SRC, PUB)
    apply_seo(PUB)

    # a tag <meta theme-color> só existe depois do apply_seo (entra nos dois
    # heads: shell e template). Confere na cópia publicada, que é o que vai
    # pro ar — count('theme-color') sozinho pegaria falso positivo no JS
    # (comentários e o seletor CSS também citam a string).
    tpl3, _, _ = read_template(open(PUB, encoding='utf8').read())
    assert '<meta name="theme-color" content="#FFFFFF">' in tpl3, \
        'meta theme-color tem que existir no head do TEMPLATE (sobrevive ao unpack)'
    print(f'publicado em {PUB} com metadados de SEO')


if __name__ == '__main__':
    sys.exit(main())
