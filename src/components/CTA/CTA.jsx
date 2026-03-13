import './CTA.css'

export default function CTA() {
    return (
        <section className="cta section" id="download">
            <div className="container">
                <div className="cta__box">
                    <div className="cta__glow" aria-hidden="true" />
                    <div className="cta__glow cta__glow--2" aria-hidden="true" />

                    <div className="cta__content">
                        <div className="section-tag">📱 Baixe Agora</div>
                        <h2 className="cta__title">
                            Comece a trabalhar no{' '}
                            <span className="text-gradient">espaço dos seus sonhos</span>{' '}
                            hoje mesmo
                        </h2>
                        <p className="cta__subtitle">
                            Mais de 12.000 profissionais já usam a Hubros.
                            Junte-se à comunidade e transforme sua forma de trabalhar.
                        </p>

                        <div className="cta__badges">
                            <a href="#" className="cta__badge" id="cta-appstore" aria-label="Baixar na App Store">
                                <div className="cta__badge-icon">🍎</div>
                                <div className="cta__badge-info">
                                    <span className="cta__badge-label">Disponível na</span>
                                    <span className="cta__badge-store">App Store</span>
                                </div>
                            </a>
                            <a href="#" className="cta__badge" id="cta-googleplay" aria-label="Baixar no Google Play">
                                <div className="cta__badge-icon">▶</div>
                                <div className="cta__badge-info">
                                    <span className="cta__badge-label">Disponível no</span>
                                    <span className="cta__badge-store">Google Play</span>
                                </div>
                            </a>
                        </div>

                        <p className="cta__disclaimer">
                            Gratuito para download • Sem mensalidade • Pague só o que usar
                        </p>
                    </div>

                    <div className="cta__visual" aria-hidden="true">
                        <div className="cta__badge-large">
                            <span>⬡</span>
                            <span>Hubros</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
