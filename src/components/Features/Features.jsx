import './Features.css'

const FEATURES = [
    {
        title: 'Busca por região',
        text: 'Encontre espaços disponíveis perto de você em tempo real, filtrando facilmente no mapa interativo.',
        icon: <><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
    },
    {
        title: 'Filtre por categoria',
        text: 'Saúde, coworking, estética, eventos e muito mais. Ache o nicho exato para o seu momento.',
        icon: <path d="M4 6h16M7 12h10M10 18h4" />,
    },
    {
        title: 'Preço transparente',
        text: 'Valor por hora ou dia antes de qualquer clique. Sem surpresas ou taxas escondidas.',
        icon: <><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></>,
    },
]

export default function Features() {
    return (
        <section className="features" id="features">
            <div className="container">
                <p className="home-label">O app em ação</p>
                <h2 className="home-h2 features__title">Encontre e reserve com poucos toques.</h2>

                <div className="features__panel">
                    {FEATURES.map(f => (
                        <article key={f.title} className="features__item">
                            <div className="features__icon" aria-hidden="true">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
                            </div>
                            <h3>{f.title}</h3>
                            <p>{f.text}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
