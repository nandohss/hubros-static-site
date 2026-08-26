#!/usr/bin/env python3
"""
Alinha o head da landing /espacos/ ao estilo novo do site: a barra deixa de ser
uma faixa branca com borda inferior e vira a mesma pill flutuante de vidro do
hubros.com.br. Nada além do head muda — o resto da landing tem design próprio.

O logotipo de lá é mantido como está.

Idempotente: se o novo head já estiver aplicado, não faz nada e sai limpo.

Mesmas regras do build_landing_espacos.py (ver memória project_landing_espacos):
  - extrair com raw_decode, nunca regex, porque há <script> aninhado
  - ao reencodar, escapar todo </script>, senão o parser HTML trunca o JSON
Os dois arquivos são tratados em separado para preservar o SEO que só existe
na cópia publicada.
"""
import json
import sys

ARQUIVOS = ['landing_page_espacos.html', 'public/espacos/index.html']
MARKER = '<script type="__bundler/template">'

# ------------------------------------------------------------------ head novo

HEADER_ANTIGO = (
    '<header style="position:sticky; top:0; z-index:30; background:rgba(255,255,255,0.9); '
    'backdrop-filter:blur(14px); border-bottom:1px solid #E6E6E8;">'
)
# 8px, e não 20: esta landing NÃO tem viewport-fit=cover, então não há
# env(safe-area-inset-top) somando — 20px ficava baixo demais no iPhone.
HEADER_NOVO = (
    '<header style="position:sticky; top:8px; z-index:30; padding:8px 16px 0;">'
)

PILL_ANTIGA = (
    '<div style="max-width:1180px; margin:0 auto; padding:16px 24px; display:flex; '
    'align-items:center; justify-content:space-between; gap:24px;">'
)
PILL_NOVA = (
    '<div style="max-width:1180px; margin:0 auto; height:60px; padding:0 10px 0 20px; '
    'display:flex; align-items:center; justify-content:space-between; gap:24px; '
    'border-radius:9999px; '
    'background:linear-gradient(150deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.44) 100%); '
    'border:1px solid rgba(255,255,255,0.92); '
    'box-shadow:0 18px 46px rgba(11,11,12,0.10), inset 0 1px 0 rgba(255,255,255,0.95), '
    'inset 0 -1px 0 rgba(255,255,255,0.40); '
    'backdrop-filter:blur(18px) saturate(1.4); -webkit-backdrop-filter:blur(18px) saturate(1.4);">'
)

# o CTA vira pill, com a sombra suave do site no lugar do retângulo de raio 10
CTA_ANTIGO = (
    'style="background:#0B0B0C; color:#FFFFFF; padding:11px 20px; border-radius:10px; '
    'font-size:15px; font-weight:600;"'
)
CTA_NOVO = (
    'style="background:#0B0B0C; color:#FFFFFF; padding:11px 22px; border-radius:9999px; '
    'font-size:15px; font-weight:600; box-shadow:0 18px 40px rgba(11,11,12,0.22);"'
)

BURGER_ANTIGO = """.esp-nav-burger {
      display: flex; align-items: center; justify-content: center;
      width: 42px; height: 42px; border-radius: 10px; border: 1px solid #E6E6E8;
      cursor: pointer; flex-shrink: 0; background: #FFFFFF;
    }"""
BURGER_NOVO = """.esp-nav-burger {
      display: flex; align-items: center; justify-content: center;
      width: 42px; height: 42px; border-radius: 9999px;
      border: 1px solid rgba(255,255,255,0.92);
      cursor: pointer; flex-shrink: 0;
      background: linear-gradient(150deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.44) 100%);
    }"""

# o menu mobile ancorava na borda inferior da faixa; agora desce solto da pill
MENU_ANTIGO = """.esp-nav-mobile {
      flex-direction: column; gap: 4px;
      position: absolute; top: 100%; left: 0; right: 0;
      background: #FFFFFF; border-bottom: 1px solid #E6E6E8;
      padding: 8px 24px 20px; box-shadow: 0 16px 32px rgba(11,11,12,0.08);
    }"""
MENU_NOVO = """.esp-nav-mobile {
      flex-direction: column; gap: 4px;
      position: absolute; top: calc(100% + 10px); left: 16px; right: 16px;
      background: linear-gradient(150deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.94) 100%);
      backdrop-filter: blur(18px) saturate(1.4); -webkit-backdrop-filter: blur(18px) saturate(1.4);
      border: 1px solid rgba(255,255,255,0.92); border-radius: 24px;
      padding: 8px 20px 16px;
      box-shadow: 0 18px 46px rgba(11,11,12,0.10), inset 0 1px 0 rgba(255,255,255,0.95);
    }"""

TROCAS = [
    (HEADER_ANTIGO, HEADER_NOVO, 'header'),
    (PILL_ANTIGA, PILL_NOVA, 'pill de vidro'),
    (CTA_ANTIGO, CTA_NOVO, 'CTA Cadastrar espaço'),
    (BURGER_ANTIGO, BURGER_NOVO, 'burger'),
    (MENU_ANTIGO, MENU_NOVO, 'menu mobile'),
]


def read_template(h):
    start = h.find(MARKER) + len(MARKER)
    tpl, end = json.JSONDecoder().raw_decode(h, start)
    assert h[end:end + 9] == '</script>', 'delimitador inesperado apos a string JSON'
    return tpl, start, end


def write_template(h, start, end, tpl):
    encoded = json.dumps(tpl).replace('</script>', '<\\/script>')
    assert '</script>' not in encoded, 'sobrou </script> cru no JSON'
    return h[:start] + encoded + h[end:]


def restyle(tpl):
    for antigo, novo, label in TROCAS:
        if novo in tpl:
            print(f'   [{label}] ja aplicado')
            continue
        n = tpl.count(antigo)
        assert n == 1, f'[{label}] esperava 1 ocorrencia, achei {n}'
        tpl = tpl.replace(antigo, novo, 1)
        print(f'   [{label}] ok')
    return tpl


def main():
    for path in ARQUIVOS:
        print(path)
        h = open(path, encoding='utf8').read()
        tpl, start, end = read_template(h)
        tpl = restyle(tpl)
        h = write_template(h, start, end, tpl)
        open(path, 'w', encoding='utf8').write(h)

        # integridade: o JSON tem que voltar a abrir e o logotipo continuar la
        tpl2, _, _ = read_template(open(path, encoding='utf8').read())
        assert '41072b8d-eacc-43e3-9f2e-83c4046f7b17' in tpl2, 'o logotipo da landing sumiu'
        assert 'esp-menu-toggle:checked ~ .esp-nav-mobile' in tpl2, 'o toggle do menu sumiu'
        assert PILL_NOVA in tpl2 and HEADER_NOVO in tpl2
        print('   integridade OK')

    # o SEO vive so na copia publicada; conferir que sobreviveu
    pub, _, _ = read_template(open('public/espacos/index.html', encoding='utf8').read())
    assert '<meta name="theme-color" content="#FFFFFF">' in pub, 'meta theme-color se perdeu'
    print('SEO da copia publicada intacto')


if __name__ == '__main__':
    sys.exit(main())
