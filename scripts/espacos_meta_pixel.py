#!/usr/bin/env python3
"""
Carrega o Pixel da Meta (/meta-pixel.js) na landing /espacos/.

A tag vai no <head> EXTERNO, o da página que o bundler entrega antes de
desempacotar, e não dentro do template JSON. Motivo: o bundler troca o <html>
inteiro com replaceWith, mas o `window` e o `document` continuam os mesmos,
então o fbq e o listener de clique do meta-pixel.js sobrevivem à troca. Assim
o template não é tocado (e as regras de reencode do build_landing_espacos.py
não entram em jogo).

Idempotente. Edita SRC e PUB.
"""
import sys

ARQ = ['landing_page_espacos.html', 'public/espacos/index.html']
MARKER = '<script type="__bundler/template">'
ANCORA = '<meta charset="utf-8">'
TAG = '<script src="/meta-pixel.js"></script>'


def main():
    for arq in ARQ:
        with open(arq, encoding='utf-8') as f:
            h = f.read()
        fim_externo = h.find(MARKER)
        assert fim_externo > 0, f'[{arq}] template do bundler nao encontrado'
        externo = h[:fim_externo]
        if TAG in externo:
            print(f'{arq}: ja tinha o pixel')
            continue
        assert externo.count(ANCORA) == 1, f'[{arq}] ancora do <head> externo nao e unica'
        i = externo.index(ANCORA) + len(ANCORA)
        h = h[:i] + '\n  ' + TAG + h[i:]
        with open(arq, 'w', encoding='utf-8') as f:
            f.write(h)
        print(f'{arq}: pixel adicionado no <head> externo')


if __name__ == '__main__':
    sys.exit(main())
