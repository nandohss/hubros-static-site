#!/usr/bin/env python3
"""
Liga o botão "Vamos conversar" da /espacos ao WhatsApp da Hubros.

Os dois botões eram <span> — apareciam como botão mas não clicavam em nada.
Viram <a> para wa.me com o número em formato internacional (55 + DDD 11).

Idempotente. Edita SRC e PUB em separado (o SEO só existe na publicada).
"""
import json
import sys
from urllib.parse import quote

ARQ = ['landing_page_espacos.html', 'public/espacos/index.html']
MARKER = '<script type="__bundler/template">'

NUMERO = '5511947411398'          # +55 11 94741-1398
MSG = 'Olá! Tenho um espaço e quero saber mais sobre a Hubros.'
LINK = f'https://wa.me/{NUMERO}?text={quote(MSG)}'

# os dois botões têm estilos próprios; cada um é trocado preservando o seu
TROCAS = [
    ('<span style="border:1px solid #D6D6DA; color:#0B0B0C; padding:16px 30px; '
     'border-radius:12px; font-size:17px; font-weight:500;">Vamos conversar</span>',
     f'<a href="{LINK}" target="_blank" rel="noopener noreferrer" '
     'style="border:1px solid #D6D6DA; color:#0B0B0C; padding:16px 30px; '
     'border-radius:12px; font-size:17px; font-weight:500;" '
     'style-hover="background:#F7F7F8;">Vamos conversar</a>',
     'botao do hero'),
    ('<span style="border:1px solid #D6D6DA; background:#FFFFFF; color:#0B0B0C; '
     'padding:17px 34px; border-radius:12px; font-size:17px; font-weight:500;">Vamos conversar</span>',
     f'<a href="{LINK}" target="_blank" rel="noopener noreferrer" '
     'style="border:1px solid #D6D6DA; background:#FFFFFF; color:#0B0B0C; '
     'padding:17px 34px; border-radius:12px; font-size:17px; font-weight:500;" '
     'style-hover="background:#F7F7F8;">Vamos conversar</a>',
     'botao do fecho'),
]


def main():
    for path in ARQ:
        h = open(path, encoding='utf8').read()
        start = h.find(MARKER) + len(MARKER)
        tpl, end = json.JSONDecoder().raw_decode(h, start)
        assert h[end:end + 9] == '</script>', 'delimitador inesperado'

        for antigo, novo, label in TROCAS:
            if novo in tpl:
                print(f'{path} [{label}] ja aplicado'); continue
            n = tpl.count(antigo)
            assert n == 1, f'{path} [{label}]: esperava 1, achei {n}'
            tpl = tpl.replace(antigo, novo, 1)
            print(f'{path} [{label}] ok')

        encoded = json.dumps(tpl).replace('</script>', '<\\/script>')
        assert '</script>' not in encoded
        open(path, 'w', encoding='utf8').write(h[:start] + encoded + h[end:])

        h2 = open(path, encoding='utf8').read()
        t2, e2 = json.JSONDecoder().raw_decode(h2, h2.find(MARKER) + len(MARKER))
        assert h2[e2:e2 + 9] == '</script>', 'JSON quebrado'
        assert t2.count(f'wa.me/{NUMERO}') == 2, 'os dois botoes tem que apontar pro WhatsApp'
        assert '>Vamos conversar</span>' not in t2, 'sobrou botao como <span>'
        print(f'   {path}: JSON valido, 2 links de WhatsApp')


if __name__ == '__main__':
    sys.exit(main())
