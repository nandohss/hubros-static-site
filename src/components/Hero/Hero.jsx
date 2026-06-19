import { useState, useEffect } from 'react'
import screenshotSrc from '../../assets/screenshot_marketplace.png'
import './Hero.css'

const HERO_PHRASES = [
    { line1: 'O espaço certo,', line2: 'na hora certa.' },
    { line1: 'Trabalhe onde', line2: 'quiser, hoje.' },
    { line1: 'Reserve em', line2: 'segundos.' },
    { line1: 'Sua produtividade,', line2: 'sem contrato.' },
]

function RotatingTitle() {
    const [index, setIndex] = useState(0)
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false)
            setTimeout(() => {
                setIndex(prev => (prev + 1) % HERO_PHRASES.length)
                setVisible(true)
            }, 500)
        }, 3500)
        return () => clearInterval(interval)
    }, [])

    const phrase = HERO_PHRASES[index]

    return (
        <h1
            className={`hero__title hero__title--animated ${visible ? 'hero__title--visible' : 'hero__title--hidden'}`}
            style={{ transitionDelay: '0.1s' }}
        >
            {phrase.line1}<br />{phrase.line2}
        </h1>
    )
}

export default function Hero() {
    return (
        <section className="hero" id="hero">
            <div className="container">
                <div className="hero__badge reveal">
                    <span className="hero__badge-tag">Lançamento</span>
                    Disponível na App Store
                </div>
                
                <RotatingTitle />
                
                <p className="hero__subtitle reveal" style={{ transitionDelay: '0.2s' }}>
                    Encontre e reserve escritórios, clínicas, salões, estúdios e muito mais. Conectamos pessoas a espaços incríveis em todo o Brasil.
                </p>
                
                <div className="hero__cta-group reveal" style={{ transitionDelay: '0.3s' }}>
                    <a href="https://apps.apple.com/br/app/hubros/id6762576263" className="btn btn-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                        App Store
                    </a>
                    <div className="btn btn-secondary" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                        Google Play <span className="btn-inline-tag">Em breve</span>
                    </div>
                </div>

                <div className="hero__trust reveal" style={{ transitionDelay: '0.4s' }}>
                    <div className="hero__trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Pagamento seguro</div>
                    <div className="hero__trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Confirmação imediata</div>
                    <div className="hero__trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Cancele quando quiser</div>
                </div>

                <div className="showcase reveal" style={{ transitionDelay: '0.5s' }}>
                    <div className="floating-card fc-left">
                        <div className="fc-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                        <div className="fc-text"><strong>Reserva confirmada!</strong><span>Hubros App</span></div>
                    </div>
                    <div className="floating-card fc-right">
                        <div className="fc-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg></div>
                        <div className="fc-text"><strong>R$ 20,00 / hora</strong><span>Pagamento Seguro</span></div>
                    </div>
                    <div className="ap-phone-wrap">
                        <div className="ap-phone">
                            <img src={screenshotSrc} alt="App Hubros Interface" className="ap-screen" />
                            <div className="ap-island"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
