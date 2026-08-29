import { useScrollReveal } from '../../hooks/useScrollReveal'
import './FAQ.css'

// Fonte única: alimenta a lista renderizada e o schema FAQPage do Seo.
// O conteúdo segue o que o produto realmente faz — o estorno automático em
// reserva recusada e o check-in por QR code vêm do back_end e do app.
export const FAQ_ITEMS = [
    {
        q: 'Como funciona a reserva?',
        a: 'Você busca pelo mapa ou por categoria, escolhe o espaço, a data e a duração — por hora ou por dia — e paga pelo app. A confirmação é imediata e o endereço completo fica na sua reserva.',
    },
    {
        q: 'Preciso assinar contrato ou pagar mensalidade?',
        a: 'Não. Não há fidelidade nem mensalidade: você paga apenas pelas horas que reservar. Use uma tarde, um dia ou toda semana, sem compromisso de continuar.',
    },
    {
        q: 'Como faço o pagamento?',
        a: 'Pelo app, com Pix ou cartão de crédito. A reserva só é confirmada depois do pagamento, então você chega com tudo resolvido.',
    },
    {
        q: 'E se o espaço não aprovar minha reserva?',
        a: 'Alguns espaços aprovam cada reserva antes de confirmar. Se a sua não for aceita, o estorno é automático — você não precisa pedir nada.',
    },
    {
        q: 'Como faço para entrar no dia da reserva?',
        a: 'Sua reserva tem um QR code no app. É só apresentá-lo na chegada: o espaço escaneia e o check-in fica registrado. Nada de papel ou cadastro na portaria.',
    },
    {
        q: 'Que tipos de espaço encontro no app?',
        a: 'Escritórios e salas de reunião, consultórios e clínicas, estúdios e salões. Todos são verificados antes de entrar no app e avaliados por quem já usou.',
    },
]

export default function FAQ() {
    const revealRef = useScrollReveal({ threshold: 0.1 })

    return (
        <section className="faq section" id="faq">
            <div className="container" ref={revealRef}>
                <div className="faq__header reveal">
                    <div className="section-tag">Perguntas Frequentes</div>
                    <h2 className="section-title">Tudo que você precisa saber</h2>
                    <p className="section-subtitle">
                        E se ficar alguma dúvida, a gente responde pela Central de Ajuda.
                    </p>
                </div>

                <div className="faq__list">
                    {FAQ_ITEMS.map((item, i) => (
                        <details
                            key={i}
                            className="faq__item reveal"
                            style={{ transitionDelay: `${i * 0.06}s` }}
                        >
                            <summary className="faq__question">
                                {item.q}
                                <span className="faq__sign" aria-hidden="true" />
                            </summary>
                            <div className="faq__answer">{item.a}</div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    )
}
