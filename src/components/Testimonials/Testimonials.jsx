import './Testimonials.css'

const testimonials = [
    {
        name: 'Ana Luiza M.',
        role: 'Designer UX • Freelancer',
        avatar: 'AL',
        rating: 5,
        text: 'A Hubros mudou minha rotina de trabalho! Consigo reservar espaços lindos por toda SP sem complicação. O app é intuitivo e o suporte é incrível.',
        color: '#6C47FF',
    },
    {
        name: 'Pedro Carvalho',
        role: 'Dev Full Stack • Remoto',
        avatar: 'PC',
        rating: 5,
        text: 'Trabalho remotamente há 3 anos e a Hubros é o melhor serviço que já usei. Preços justos, espaços verificados e pagamento super fácil.',
        color: '#FF6B6B',
    },
    {
        name: 'Mariana Souza',
        role: 'Host • Proprietária de Espaço',
        avatar: 'MS',
        rating: 5,
        text: 'Como host, meu espaço nunca ficou tão cheio! A plataforma é simples, os pagamentos chegam na hora e o suporte resolve tudo rapidamente.',
        color: '#4ECDC4',
    },
]

export default function Testimonials() {
    return (
        <section className="testimonials section" id="testimonials">
            <div className="testimonials__bg-glow" aria-hidden="true" />
            <div className="container">
                <div className="testimonials__header">
                    <div className="section-tag">💬 Depoimentos</div>
                    <h2 className="section-title">
                        O que nossa comunidade{' '}
                        <span className="text-gradient">está dizendo</span>
                    </h2>
                </div>

                <div className="testimonials__grid">
                    {testimonials.map((t, i) => (
                        <div key={i} className="testimonials__card card" style={{ '--accent': t.color }}>
                            <div className="testimonials__stars">
                                {'⭐'.repeat(t.rating)}
                            </div>
                            <p className="testimonials__text">"{t.text}"</p>
                            <div className="testimonials__author">
                                <div className="testimonials__avatar" style={{ background: t.color }}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="testimonials__name">{t.name}</p>
                                    <p className="testimonials__role">{t.role}</p>
                                </div>
                            </div>
                            <div className="testimonials__accent-line" aria-hidden="true" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
