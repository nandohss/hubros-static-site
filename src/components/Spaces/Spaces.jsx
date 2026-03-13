import './Spaces.css'

const spaces = [
    {
        name: 'Coworking Faria Lima',
        location: 'São Paulo, SP',
        price: 'R$ 35/hora',
        rating: '4.9',
        tags: ['Wi-Fi Gigabit', 'Café', 'Salas privadas'],
        gradient: 'linear-gradient(135deg, #6C47FF 0%, #4B2FCC 100%)',
    },
    {
        name: 'Sala Criativa Rio Sul',
        location: 'Rio de Janeiro, RJ',
        price: 'R$ 28/hora',
        rating: '4.8',
        tags: ['Vista para o mar', 'Projetor', 'Ar-condicionado'],
        gradient: 'linear-gradient(135deg, #FF6B6B 0%, #CC4B2F 100%)',
    },
    {
        name: 'Hub Tecnológico BH',
        location: 'Belo Horizonte, MG',
        price: 'R$ 22/hora',
        rating: '4.7',
        tags: ['Estacionamento', 'Recepção', '24h'],
        gradient: 'linear-gradient(135deg, #4ECDC4 0%, #2FAACC 100%)',
    },
]

export default function Spaces() {
    return (
        <section className="spaces section" id="spaces">
            <div className="container">
                <div className="spaces__header">
                    <div className="section-tag">🏢 Espaços em Destaque</div>
                    <h2 className="section-title">
                        Espaços <span className="text-gradient">incríveis</span>{' '}
                        por todo o Brasil
                    </h2>
                    <p className="section-subtitle">
                        Dezenas de espaços verificados e avaliados pela comunidade esperando por você.
                    </p>
                </div>

                <div className="spaces__grid">
                    {spaces.map((space, i) => (
                        <div key={i} className="spaces__card">
                            <div className="spaces__card-img" style={{ background: space.gradient }}>
                                <span className="spaces__card-rating">⭐ {space.rating}</span>
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
                                <button className="btn btn-primary spaces__card-btn" id={`space-cta-${i}`}>
                                    Ver Detalhes
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="spaces__footer">
                    <a href="#download" className="btn btn-secondary btn-lg">
                        Ver todos os espaços no app →
                    </a>
                </div>
            </div>
        </section>
    )
}
