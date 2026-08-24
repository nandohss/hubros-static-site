import HubrosLogo from '../Logo/HubrosLogo'
import './CTA.css'

export default function CTA() {
    return (
        <section className="cta section" id="download">
            <div className="container">
                <div className="cta__box">
                    <div className="cta__content">
                        <div className="section-tag">Baixe Agora</div>
                        <h2 className="cta__title">
                            Comece a trabalhar no{' '}
                            <span className="text-gradient">espaço dos seus sonhos</span>{' '}
                            hoje mesmo
                        </h2>
                        <p className="cta__subtitle">
                            O Hubros está chegando. Seja um dos primeiros a descobrir
                            espaços de coworking incríveis e transformar a sua forma de trabalhar.
                        </p>

                        <div className="cta__badges">
                            <a href="https://apps.apple.com/br/app/hubros/id6762576263" className="cta__badge" id="cta-appstore" aria-label="Baixar na App Store">
                                <img
                                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                    alt="Download on the App Store"
                                    className="cta__store-badge"
                                />
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=br.com.hubros.hubros_app" className="cta__badge" id="cta-googleplay" aria-label="Baixar no Google Play" target="_blank" rel="noopener noreferrer">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                    alt="Get it on Google Play"
                                    className="cta__store-badge"
                                />
                            </a>
                        </div>

                        <p className="cta__disclaimer">
                            Gratuito para download • Sem mensalidade • Pague só o que usar
                        </p>
                    </div>

                    <div className="cta__visual" aria-hidden="true">
                        <HubrosLogo size={120} className="cta__logo-large" />
                    </div>
                </div>
            </div>
        </section>
    )
}
