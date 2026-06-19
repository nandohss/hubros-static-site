import { useScrollReveal } from '../../hooks/useScrollReveal'
import './Testimonials.css'

const testimonials = [
    {
        name: 'Ana Luiza M.',
        role: 'Designer UX • Freelancer',
        avatar: 'AL',
        rating: 5,
        text: 'A Hubros mudou minha rotina de trabalho! Consigo reservar espaços lindos por toda SP sem complicação. O app é intuitivo e o suporte é incrível.',
    },
    {
        name: 'Camila Rossi',
        role: 'Dentista • Autônoma',
        avatar: 'CR',
        rating: 5,
        text: 'Alugar consultórios por hora via Hubros salvou minha agenda! Consigo atender em diferentes regiões com a mesma praticidade. Os espaços são impecáveis e muito bem equipados.',
    },
    {
        name: 'Carlos Mendes',
        role: 'Host • Proprietário de Espaço',
        avatar: 'CM',
        rating: 5,
        text: 'Como host, meu espaço nunca ficou tão cheio! A plataforma é simples, os pagamentos chegam na hora e o suporte resolve tudo rapidamente.',
    },
]

export default function Testimonials() {
    const revealRef = useScrollReveal({ threshold: 0.1 })

    return (
        <section className="testimonials section" id="testimonials">
            <div className="container" ref={revealRef}>
                <div className="testimonials__header reveal">
                    <div className="section-tag">Depoimentos</div>
                    <h2 className="section-title">
                        O que nossa comunidade{' '}
                        <span className="text-gradient">está dizendo</span>
                    </h2>
                </div>

                <div className="testimonials__grid">
                    {testimonials.map((t, i) => (
                        <div key={i} className="testimonials__card card reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                            <div className="testimonials__stars" style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                                {[...Array(t.rating)].map((_, j) => (
                                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#1C1A14" stroke="#1C1A14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                ))}
                            </div>
                            <p className="testimonials__text">"{t.text}"</p>
                            <div className="testimonials__author">
                                <div className="testimonials__avatar">
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="testimonials__name">{t.name}</p>
                                    <p className="testimonials__role">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
