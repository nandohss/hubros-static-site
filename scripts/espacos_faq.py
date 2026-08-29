#!/usr/bin/env python3
"""
Adiciona um FAQ à /espacos, entre os fundadores e o CTA final.

Acordeão em <details>/<summary>: funciona sem JS (o bundler troca os nós do
DOM depois que os scripts rodam) e já vem acessível por teclado e leitor de
tela. O conteúdo segue o que a própria página afirma e o modelo real de
pagamento verificado no back_end (ver memórias reference_pagarme_split_model
e project_cohoster_wallet_activation).

Idempotente. Edita SRC e PUB em separado (o SEO só existe na publicada).
"""
import json
import sys

from espacos_whatsapp import LINK as LINK_WHATSAPP

ARQ = ['landing_page_espacos.html', 'public/espacos/index.html']
MARKER = '<script type="__bundler/template">'
ANCORA_CSS = '  .esp-nav-desktop { display: flex; align-items: center; gap: 28px; }'

CSS_FAQ = """  /* ===== FAQ =====
     Discreto de proposito: fecha a pagina depois do CTA, sem competir com ele.
     Sem card e sem sombra — divisorias e tipografia menor. */
  .esp-faq-sec { max-width: 720px; margin: 0 auto; padding: clamp(40px,6vw,64px) 24px clamp(56px,8vw,88px); }
  .esp-faq-title { margin: 0 0 28px; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; color: #0B0B0C; }
  .esp-faq-list { border-top: 1px solid #E6E6E8; }
  .esp-faq { border-bottom: 1px solid #E6E6E8; }
  .esp-faq > summary {
    list-style: none; cursor: pointer;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    padding: 16px 0;
    font-size: 16px; font-weight: 500; color: #0B0B0C; line-height: 1.5;
    transition: color .15s ease;
  }
  .esp-faq > summary::-webkit-details-marker { display: none; }
  .esp-faq > summary:hover { color: #56565B; }
  .esp-faq > summary:focus-visible { outline: 2px solid #B08F52; outline-offset: 2px; border-radius: 4px; }
  /* o sinal vira "−" quando aberto; rotacao em vez de troca de caractere */
  .esp-faq__sign { flex: 0 0 auto; width: 14px; height: 14px; position: relative; transition: transform .25s ease; }
  .esp-faq__sign::before, .esp-faq__sign::after {
    content: ""; position: absolute; inset: 50% 0 auto 0;
    height: 1.5px; background: #9C9CA2; border-radius: 2px;
  }
  .esp-faq__sign::after { transition: opacity .25s ease; transform: rotate(90deg); }
  .esp-faq[open] > summary .esp-faq__sign { transform: rotate(180deg); }
  .esp-faq[open] > summary .esp-faq__sign::after { opacity: 0; }
  .esp-faq__body { padding: 0 32px 20px 0; font-size: 15px; line-height: 1.7; color: #56565B; }
  @media (prefers-reduced-motion: reduce) {
    .esp-faq__sign, .esp-faq__sign::after { transition: none; }
  }

"""

PERGUNTAS = [
    ("Preciso abrir a agenda inteira?",
     "Não. Você abre só as janelas que hoje ficam ociosas — uma tarde, um dia da semana, um "
     "período do mês. Mensalistas e contratos fixos seguem exatamente como estão, e a agenda "
     "aberta pode ser ajustada ou fechada quando você quiser."),
    ("Meu espaço não é exatamente um coworking. Posso cadastrar?",
     "Pode. Escritórios, consultórios, clínicas, estúdios, salas de reunião e salões estão no "
     "app. O que conta é ter uma sala boa de trabalhar e horários em que ela fica parada."),
    ("Quem são os profissionais que chegam no meu espaço?",
     "Consultores, advogados, contadores e times remotos em reunião; psicólogos, nutricionistas, "
     "fisioterapeutas e dentistas atendendo por hora; e workshops, treinamentos e gravações. "
     "Todos chegam identificados no app e com a reserva paga antes de entrar."),
    ("Sou obrigado a aceitar todas as reservas?",
     "Não. Você escolhe entre aprovação automática e aprovar cada profissional antes de "
     "confirmar. Preço, horários e dias abertos também são seus, e dá para ajustar quando quiser."),
    ("Preciso ter alguém na recepção?",
     "Não precisa montar nada por causa da Hubros: a reserva chega confirmada e paga, então no "
     "horário é só abrir a porta. Para registrar a chegada, o profissional mostra o QR code da "
     "reserva e você escaneia pelo app — leva um segundo. E se o seu espaço já tem recepção ou "
     "controle de acesso próprio, siga com ele: os dois convivem sem problema."),
    ("Quando o dinheiro cai na minha conta?",
     "A divisão acontece na hora: assim que a reserva é paga no app, a sua parte já vai para "
     "a conta de recebimento aberta no seu CNPJ ou CPF. O repasse para a sua conta bancária é "
     "automático, uma vez por mês, com o extrato das reservas."),
    ("Quando meu espaço começa a aparecer no app?",
     "O cadastro leva alguns minutos. O espaço entra no marketplace quando você ativa a conta "
     "de recebimento — é a mesma etapa que libera os pagamentos, então vale fazer na sequência "
     "do cadastro."),
    ("Posso cadastrar como pessoa física?",
     "Sim, CNPJ ou CPF. No CNPJ são pedidos também os dados da empresa e do sócio "
     "administrador — exigência do banco para abrir a conta de recebimento, não da Hubros."),
    ("Preciso de algo que o app ainda não faz. Dá para pedir?",
     "Fale com a gente. A Hubros está em evolução constante e boa parte do que existe hoje "
     f'nasceu de pedido de quem opera espaço. Chame no <a href="{LINK_WHATSAPP}" target="_blank" '
     'rel="noopener noreferrer" style="color:#B08F52; font-weight:600;">WhatsApp</a> e conte o '
     "que faltou: se fizer sentido para os outros espaços, entra no roteiro."),
]


def bloco_faq():
    itens = '\n'.join(
        f'''        <details class="esp-faq">
          <summary>{p}<span class="esp-faq__sign" aria-hidden="true"></span></summary>
          <div class="esp-faq__body">{r}</div>
        </details>'''
        for p, r in PERGUNTAS
    )
    return f'''  <section id="faq" class="esp-faq-sec">
      <h2 class="esp-faq-title">Ainda com dúvida?</h2>
      <div class="esp-faq-list">
{itens}
      </div>
  </section>

'''


# entra depois do CTA final, entre ele e o rodape
ANCORA_SEC = '  <footer style="background:#0B0B0C; color:#F7F7F8;">'


def main():
    for path in ARQ:
        h = open(path, encoding='utf8').read()
        start = h.find(MARKER) + len(MARKER)
        tpl, end = json.JSONDecoder().raw_decode(h, start)
        assert h[end:end + 9] == '</script>', 'delimitador inesperado'

        if 'id="faq"' in tpl:
            print(f'{path}: ja aplicado')
            continue

        assert tpl.count(ANCORA_CSS) == 1, f'{path}: ancora de CSS nao encontrada'
        tpl = tpl.replace(ANCORA_CSS, CSS_FAQ + ANCORA_CSS, 1)

        # o FAQ entra entre o CTA final e o rodape
        n = tpl.count(ANCORA_SEC)
        assert n == 1, f'{path}: esperava 1 ancora do rodape, achei {n}'
        tpl = tpl.replace(ANCORA_SEC, bloco_faq() + ANCORA_SEC, 1)

        encoded = json.dumps(tpl).replace('</script>', '<\\/script>')
        assert '</script>' not in encoded
        open(path, 'w', encoding='utf8').write(h[:start] + encoded + h[end:])

        h2 = open(path, encoding='utf8').read()
        t2, e2 = json.JSONDecoder().raw_decode(h2, h2.find(MARKER) + len(MARKER))
        assert h2[e2:e2 + 9] == '</script>', 'JSON quebrado'
        assert t2.count('<details class="esp-faq">') == len(PERGUNTAS)
        assert t2.count('</section>') == t2.count('<section')
        assert 'Cadastre seu coworking e comece hoje' in t2, 'o CTA final tem que continuar'
        print(f'{path}: FAQ com {len(PERGUNTAS)} perguntas, JSON valido')


if __name__ == '__main__':
    sys.exit(main())
