import StoreBadges from '../StoreBadges/StoreBadges'
import './CTA.css'

export default function CTA() {
    return (
        <section className="cta" id="download">
            <div className="container">
                <div className="cta__inner">
                    <h2 className="cta__title">Reserve em segundos<span className="cta__dot">.</span></h2>
                    <div className="cta__row">
                        <p className="home-lead">
                            Comece hoje mesmo, no espaço certo para você. Encontre e reserve escritórios, clínicas, salões, estúdios e muito mais.
                        </p>
                        <div>
                            <StoreBadges idPrefix="cta" />
                            <p className="cta__note">Gratuito para download · Sem mensalidade · Pague só o que usar</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
