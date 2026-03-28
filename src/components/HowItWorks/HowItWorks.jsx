import { SmartSearchIcon } from '../Icons/SmartSearchIcon'
import { DownloadIcon } from '../Icons/DownloadIcon'
import { InstantReservationIcon } from '../Icons/InstantReservationIcon'
import { CheckmarkIcon } from '../Icons/CheckmarkIcon'
import './HowItWorks.css'

const steps = [
    {
        number: '01',
        icon: <DownloadIcon size="1em" />,
        title: 'Baixe o App',
        description: 'Disponível gratuitamente na App Store e Google Play. Crie sua conta em menos de 2 minutos.',
    },
    {
        number: '02',
        icon: <SmartSearchIcon size="1em" />,
        title: 'Encontre seu Espaço',
        description: 'Filtre por categoria, localização, capacidade, preço e disponibilidade em tempo real.',
    },
    {
        number: '03',
        icon: <InstantReservationIcon size="1em" />,
        title: 'Reserve Online',
        description: 'Escolha data, horário e duração. Pague de forma segura diretamente pelo app.',
    },
    {
        number: '04',
        icon: <CheckmarkIcon size="1em" />,
        title: 'Use & Avalie',
        description: 'Faça check-in pelo app, aproveite o espaço e deixe sua avaliação para ajudar outros usuários.',
    },
]

export default function HowItWorks() {
    return (
        <section className="hiw section" id="how-it-works">
            <div className="container">
                <div className="hiw__header">
                    <div className="section-tag">Como Funciona</div>
                    <h2 className="section-title">
                        Reserve o espaço certo em{' '}
                        <span className="text-gradient">4 passos simples</span>
                    </h2>
                    <p className="section-subtitle">
                        Sem complicação, sem burocracia. Encontre e reserve o espaço
                        perfeito para o que você precisar.
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
