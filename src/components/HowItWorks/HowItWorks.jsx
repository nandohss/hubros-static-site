import './HowItWorks.css'

const steps = [
    {
        title: 'Busque pelo mapa ou categoria',
        description: 'Use filtros de localização, tipo de espaço, capacidade e disponibilidade em tempo real para encontrar exatamente o que precisa.',
    },
    {
        title: 'Escolha o horário e reserve',
        description: 'Selecione a data, hora e duração. Reserve por hora ou por dia com confirmação imediata e pagamento seguro pelo app.',
    },
    {
        title: 'Chegue, use e avalie',
        description: 'Faça check-in com o voucher digital, aproveite o espaço e deixe sua avaliação para ajudar a comunidade Hubros a crescer.',
    },
]

export default function HowItWorks() {
    return (
        <section className="hiw" id="how-it-works">
            <div className="container">
                <div className="home-split hiw__head">
                    <div>
                        <p className="home-label">Como funciona</p>
                        <h2 className="home-h2">Reserve em 3 passos.</h2>
                    </div>
                    <p className="home-lead">
                        No Hubros, você descobre espaços próximos, filtra pela categoria ideal e vê o preço por hora ou dia, tudo antes de reservar.
                    </p>
                </div>

                <ol className="hiw__steps">
                    {steps.map((step, i) => (
                        <li key={step.title}>
                            <span className="hiw__n" aria-hidden="true">{i + 1}</span>
                            <h3><span className="sr-only">Passo {i + 1}: </span>{step.title}</h3>
                            <p>{step.description}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}
