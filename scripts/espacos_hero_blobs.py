#!/usr/bin/env python3
"""
Leva os blobs da home para a primeira dobra da /espacos — a seção que aparece
ao abrir a página, que hoje é branco liso.

Mesma receita do site (index.css): aurora estática de apoio nas bordas mais
dois blobs animados, um grafite e um dourado, com blur largo e opacidade
baixa. Aqui eles são pseudo-elementos, não <div>: o bundler troca os nós do
DOM depois que os scripts rodam (ver memória project_landing_espacos), e
pseudo-elemento vive no CSS, então sobrevive à troca.

Idempotente. Edita SRC e PUB em separado para não apagar o SEO da publicada.
"""
import json
import sys

ARQ = ['landing_page_espacos.html', 'public/espacos/index.html']
MARKER = '<script type="__bundler/template">'

ANCORA_CSS = '  .esp-nav-desktop { display: flex; align-items: center; gap: 28px; }'

CSS_BLOBS = """  /* ===== Blobs da home na primeira dobra =====
     overflow:hidden aqui é seguro (é a seção, não o html/body — no body
     quebraria o sticky do header, ver comentário de overflow-x acima).
     Os blobs ficam nas bordas, fora do caminho da leitura. */
  .esp-hero-bg {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(820px 820px at 92% 0%,  rgba(43,43,47,0.10) 0%, rgba(43,43,47,0) 62%),
      radial-gradient(560px 560px at 97% 6%,  rgba(214,187,135,0.10) 0%, rgba(214,187,135,0) 66%),
      radial-gradient(760px 760px at 4% 88%,  rgba(43,43,47,0.08) 0%, rgba(43,43,47,0) 62%),
      linear-gradient(180deg,#FFFFFF 0%,#F7F7F8 100%);
  }
  .esp-hero-bg > * { position: relative; z-index: 1; }
  .esp-hero-bg::before,
  .esp-hero-bg::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    transform: translateZ(0);
  }
  .esp-hero-bg::before {
    top: -12%; right: -10%; width: 33vw; height: 33vw;
    background: #D6BB87; opacity: 0.20; filter: blur(110px);
    animation: esp-drift-a 24s ease-in-out infinite alternate;
  }
  .esp-hero-bg::after {
    bottom: -18%; left: -12%; width: 30vw; height: 30vw;
    background: #9CA3AF; opacity: 0.22; filter: blur(100px);
    animation: esp-drift-b 28s ease-in-out infinite alternate-reverse;
  }
  @keyframes esp-drift-a {
    0% { transform: translate3d(0,0,0) scale(1); }
    100% { transform: translate3d(-8vw,8vh,0) scale(1.15); }
  }
  @keyframes esp-drift-b {
    0% { transform: translate3d(0,0,0) scale(1); }
    100% { transform: translate3d(10vw,-6vh,0) scale(1.12); }
  }
  @media (max-width: 768px) {
    .esp-hero-bg::before { width: 64vw; height: 64vw; opacity: 0.15; }
    .esp-hero-bg::after { width: 58vw; height: 58vw; opacity: 0.16; }
  }
  @media (prefers-reduced-motion: reduce) {
    .esp-hero-bg::before, .esp-hero-bg::after { animation: none; }
  }

"""

SECTION_ANT = '<section style="background:linear-gradient(180deg,#FFFFFF 0%,#F7F7F8 100%);">'
SECTION_NOV = '<section class="esp-hero-bg">'


def main():
    for path in ARQ:
        h = open(path, encoding='utf8').read()
        start = h.find(MARKER) + len(MARKER)
        tpl, end = json.JSONDecoder().raw_decode(h, start)
        assert h[end:end + 9] == '</script>', 'delimitador inesperado'

        if '.esp-hero-bg' in tpl:
            print(f'{path}: ja aplicado')
            continue

        assert tpl.count(ANCORA_CSS) == 1, f'{path}: ancora de CSS nao encontrada'
        tpl = tpl.replace(ANCORA_CSS, CSS_BLOBS + ANCORA_CSS, 1)

        assert tpl.count(SECTION_ANT) == 1, f'{path}: primeira secao nao encontrada'
        tpl = tpl.replace(SECTION_ANT, SECTION_NOV, 1)

        encoded = json.dumps(tpl).replace('</script>', '<\\/script>')
        assert '</script>' not in encoded
        open(path, 'w', encoding='utf8').write(h[:start] + encoded + h[end:])

        h2 = open(path, encoding='utf8').read()
        t2, e2 = json.JSONDecoder().raw_decode(h2, h2.find(MARKER) + len(MARKER))
        assert h2[e2:e2 + 9] == '</script>', 'JSON quebrado'
        assert '.esp-hero-bg::before' in t2 and 'class="esp-hero-bg"' in t2
        assert 'overflow-x: clip' in t2, 'o clip do html/body tem que continuar'
        print(f'{path}: blobs aplicados, JSON valido')


if __name__ == '__main__':
    sys.exit(main())
