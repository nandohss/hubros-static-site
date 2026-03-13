import './Features.css'

const features = [
    {
        icon: '🔍',
        title: 'Busca Inteligente',
        description: 'Filtre por localização, capacidade, amenidades e disponibilidade em tempo real. Encontre o espaço ideal em segundos.',
        color: 'rgba(255,255,255,0.15)',
    },
    {
        icon: '📅',
        title: 'Reserva Instantânea',
        description: 'Reserve por hora, dia ou mês com apenas alguns toques. Confirmação imediata sem burocracia.',
        color: 'rgba(255,255,255,0.12)',
    },
    {
        icon: '🏷️',
        title: 'Vouchers & Cupons',
        description: 'Aproveite descontos exclusivos com nosso sistema de vouchers. Economize em cada reserva.',
        color: 'rgba(255,255,255,0.18)',
    },
    {
        icon: '⭐',
        title: 'Avaliações Reais',
        description: 'Leia avaliações autênticas de outros profissionais. Escolha com confiança.',
        color: 'rgba(255,255,255,0.10)',
    },
    {
        icon: '🔒',
        title: 'Pagamento Seguro',
        description: 'Transações protegidas com criptografia. Sua segurança financeira é nossa prioridade.',
        color: 'rgba(255,255,255,0.14)',
    },
    {
        icon: '💼',
        title: 'Para Hosts',
        description: 'Monetize seu espaço ocioso. Cadastre, configure preços e receba pagamentos automaticamente.',
        color: 'rgba(255,255,255,0.16)',
    },
]

export default function Features() {
    return (
        <section className="features section" id="features">
            <div className="container">
                <div className="features__header">
                    <div className="section-tag">✨ Funcionalidades</div>
                    <h2 className="section-title">
                        Tudo que você precisa{' '}
                        <span className="text-gradient">em um só app</span>
                    </h2>
                    <p className="section-subtitle">
                        Do descobrimento à reserva, passando pelo check-in e avaliação.
                        A Hubros cobre toda a jornada do profissional moderno.
                    </p>
                </div>

                <div className="features__grid">
                    {features.map((feature, i) => (
                        <div key={i} className="features__card card" style={{ '--accent': feature.color }}>
                            <div className="features__icon">{feature.icon}</div>
                            <h3 className="features__card-title">{feature.title}</h3>
                            <p className="features__card-desc">{feature.description}</p>
                            <div className="features__card-glow" aria-hidden="true" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
