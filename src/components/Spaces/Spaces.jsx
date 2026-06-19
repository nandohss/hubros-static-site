import './Spaces.css'

const spaces = [
    {
        name: 'Coworking Faria Lima',
        location: 'São Paulo, SP',
        price: 'R$ 35/hora',
        rating: '4.9',
        tags: ['Wi-Fi Gigabit', 'Café', 'Salas privadas'],
        gradient: 'rgba(0,0,0,0.05)',
    },
    {
        name: 'Consultório Vila Madalena',
        location: 'São Paulo, SP',
        price: 'R$ 28/hora',
        rating: '4.8',
        tags: ['Recepção', 'Ar-condicionado', 'Estacionamento'],
        gradient: 'rgba(0,0,0,0.05)',
    },
    {
        name: 'Estúdio Pinheiros',
        location: 'São Paulo, SP',
        price: 'R$ 22/hora',
        rating: '4.7',
        tags: ['Wi-Fi', 'Projetor', 'Cozinha'],
        gradient: 'rgba(0,0,0,0.05)',
    },
]

export default function Spaces() {
    return (
        <section className="spaces section" id="spaces">
            <div className="container">
                <div className="spaces__header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#1C1A14', letterSpacing: '-0.04em' }}>
                        Espaços incríveis perto de você
                    </h2>
                    <p className="section-subtitle" style={{ margin: '0 auto' }}>
                        Dezenas de espaços verificados e avaliados pela comunidade<br />esperando por você.
                    </p>
                </div>


                <div className="spaces__grid">
                    {spaces.map((space, i) => (
                        <div key={i} className="spaces__card">
                            <div className="spaces__card-img" style={{ background: space.gradient }}>
                                <span className="spaces__card-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#1C1A14" stroke="#1C1A14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                    {space.rating}
                                </span>
                            </div>
                            <div className="spaces__card-body">
                                <div className="spaces__card-meta">
                                    <span className="spaces__card-location">📍 {space.location}</span>
                                    <span className="spaces__card-price">{space.price}</span>
                                </div>
                                <h3 className="spaces__card-name">{space.name}</h3>
                                <div className="spaces__card-tags">
                                    {space.tags.map((tag, j) => (
                                        <span key={j} className="spaces__tag">{tag}</span>
                                    ))}
                                </div>
                                <a href="https://apps.apple.com/br/app/hubros/id6762576263" className="btn btn-primary spaces__card-btn" id={`space-cta-${i}`}>
                                    Ver Detalhes
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="spaces__footer">
                    <a href="https://apps.apple.com/br/app/hubros/id6762576263" className="btn btn-secondary btn-lg">
                        Ver todos os espaços no app →
                    </a>
                </div>
            </div>
        </section>
    )
}
