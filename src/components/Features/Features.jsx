import { useScrollReveal } from '../../hooks/useScrollReveal'
import './Features.css'

export default function Features() {
    const revealRef = useScrollReveal({ threshold: 0.1 });

    return (
        <section className="features section" id="features">
            <div className="container">
                <div className="features__header">
                    <div className="section-tag reveal">O App em Ação</div>
                    <h2 className="section-title reveal" style={{ transitionDelay: '0.1s' }}>
                        Encontre e reserve{' '}
                        <span className="text-gradient">com poucos toques</span>
                    </h2>
                </div>

                <div className="bento-grid" ref={revealRef}>
                    {/* Card 1 (Large) */}
                    <div className="bento-card bento-large reveal" style={{ transitionDelay: '0.2s' }}>
                        <div className="bento-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <h3>Busca por região</h3>
                        <p>Encontre espaços disponíveis perto de você em tempo real, filtrando facilmente no mapa interativo.</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bento-card reveal" style={{ transitionDelay: '0.3s' }}>
                        <div className="bento-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                        <h3>Filtre por categoria</h3>
                        <p>Saúde, coworking, estética, eventos e muito mais. Ache o nicho exato para o seu momento.</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bento-card reveal" style={{ transitionDelay: '0.4s' }}>
                        <div className="bento-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </div>
                        <h3>Preço transparente</h3>
                        <p>Valor por hora ou dia antes de qualquer clique. Sem surpresas ou taxas escondidas.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
