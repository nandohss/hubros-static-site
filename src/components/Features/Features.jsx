import { SmartSearchIcon } from '../Icons/SmartSearchIcon'
import { InstantReservationIcon } from '../Icons/InstantReservationIcon'
import { VoucherIcon } from '../Icons/VoucherIcon'
import { RealReviewsIcon } from '../Icons/RealReviewsIcon'
import { SecurePaymentIcon } from '../Icons/SecurePaymentIcon'
import { ForHostsIcon } from '../Icons/ForHostsIcon'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import './Features.css'

const features = [
    {
        icon: <SmartSearchIcon size="1em" />,
        title: 'Busca Inteligente',
        description: 'Filtre por localização, categoria, capacidade e disponibilidade em tempo real. Encontre o espaço ideal em segundos.',
        color: 'rgba(255,255,255,0.15)',
    },
    {
        icon: <InstantReservationIcon size="1em" />,
        title: 'Reserva Instantânea',
        description: 'Reserve por hora ou dia com apenas alguns toques. Confirmação imediata e sem burocracia.',
        color: 'rgba(255,255,255,0.12)',
    },
    {
        icon: <VoucherIcon size="1em" />,
        title: 'Vouchers & Cupons',
        description: 'Aproveite descontos exclusivos com nosso sistema de vouchers. Economize em cada reserva.',
        color: 'rgba(255,255,255,0.18)',
    },
    {
        icon: <RealReviewsIcon size="1em" />,
        title: 'Avaliações Reais',
        description: 'Leia avaliações autênticas de quem já usou o espaço. Escolha com confiança.',
        color: 'rgba(255,255,255,0.10)',
    },
    {
        icon: <SecurePaymentIcon size="1em" />,
        title: 'Pagamento Seguro',
        description: 'Transações protegidas com criptografia. Sua segurança financeira é nossa prioridade.',
        color: 'rgba(255,255,255,0.14)',
    },
    {
        icon: <ForHostsIcon size="1em" />,
        title: 'Para Hosts',
        description: 'Monetize seu espaço ocioso. Cadastre, configure preços e receba pagamentos automaticamente.',
        color: 'rgba(255,255,255,0.16)',
    },
]

export default function Features() {
    const revealRef = useScrollReveal({ threshold: 0.1 });

    return (
        <section className="features section" id="features">
            <div className="container">
                <div className="features__header">
                    <div className="section-tag">Funcionalidades</div>
                    <h2 className="section-title">
                        Tudo que você precisa{' '}
                        <span className="text-gradient">em um só app</span>
                    </h2>
                    <p className="section-subtitle">
                        Do descobrimento à reserva, passando pelo check-in e avaliação.
                        A Hubros cobre toda a jornada — seja para trabalhar, atender ou criar.
                    </p>
                </div>

                <div className="features__grid" ref={revealRef}>
                    {features.map((feature, i) => (
                        <div key={i} className="features__card card reveal" style={{ '--accent': feature.color, transitionDelay: `${i * 0.15}s` }}>
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
