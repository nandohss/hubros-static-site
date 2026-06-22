import { useScrollReveal } from '../../hooks/useScrollReveal'
import './HowItWorks.css'

const steps = [
    {
        number: '1',
        title: 'Busque pelo mapa ou categoria',
        description: 'Use filtros de localização, tipo de espaço, capacidade e disponibilidade em tempo real para encontrar exatamente o que precisa.',
    },
    {
        number: '2',
        title: 'Escolha o horário e reserve',
        description: 'Selecione a data, hora e duração. Reserve por hora ou por dia com confirmação imediata e pagamento seguro pelo app.',
    },
    {
        number: '3',
        title: 'Chegue, use e avalie',
        description: 'Faça check-in com o voucher digital, aproveite o espaço e deixe sua avaliação para ajudar a comunidade Hubros a crescer.',
    },
]

export default function HowItWorks() {
    const revealRef = useScrollReveal({ threshold: 0.1 })

    return (
        <section className="hiw section" id="how-it-works">
            <div className="container" ref={revealRef}>
                <div className="hiw__header reveal">
                    <div className="section-tag">Como Funciona</div>
                    <h2 className="section-title">
                        Reserve em 3 passos simples
                    </h2>
                    <p className="section-subtitle">
                        No Hubros, você descobre espaços próximos, filtra pela categoria ideal e vê o preço por hora ou dia — tudo antes de reservar.
                    </p>
                </div>

                <div className="steps-grid">
                    {steps.map((step, i) => (
                        <div key={i} className="step-card reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                            <div className="step-number">{step.number}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
