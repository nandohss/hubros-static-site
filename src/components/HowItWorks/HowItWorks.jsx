import './HowItWorks.css'

const steps = [
    {
        number: '01',
        icon: '📲',
        title: 'Baixe o App',
        description: 'Disponível gratuitamente na App Store e Google Play. Crie sua conta em menos de 2 minutos.',
    },
    {
        number: '02',
        icon: '🔍',
        title: 'Encontre seu Espaço',
        description: 'Use filtros avançados: localização, tipo de espaço, capacidade, preço e amenidades.',
    },
    {
        number: '03',
        icon: '📅',
        title: 'Reserve Online',
        description: 'Escolha data, horário e duração. Pague de forma segura diretamente pelo app.',
    },
    {
        number: '04',
        icon: '🚀',
        title: 'Trabalhe & Avalie',
        description: 'Faça check-in pelo app, aproveite o espaço e avalie sua experiência para ajudar a comunidade.',
    },
]

export default function HowItWorks() {
    return (
        <section className="hiw section" id="how-it-works">
            <div className="container">
                <div className="hiw__header">
                    <div className="section-tag">💡 Como Funciona</div>
                    <h2 className="section-title">
                        De 0 a trabalhando em{' '}
                        <span className="text-gradient">4 passos simples</span>
                    </h2>
                    <p className="section-subtitle">
                        Sem complicação, sem burocracia. Encontre e reserve o espaço
                        perfeito de forma rápida e intuitiva.
                    </p>
                </div>

                <div className="hiw__steps">
                    {steps.map((step, i) => (
                        <div key={i} className="hiw__step">
                            <div className="hiw__step-number">{step.number}</div>
                            <div className="hiw__step-connector" aria-hidden="true" />
                            <div className="hiw__step-card card">
                                <span className="hiw__step-icon">{step.icon}</span>
                                <h3 className="hiw__step-title">{step.title}</h3>
                                <p className="hiw__step-desc">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
