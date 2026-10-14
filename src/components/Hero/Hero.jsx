import { useState, useEffect } from 'react'
import screenshotSrc from '../../assets/screenshot_marketplace.png'
import IPhone3D from '../IPhone3D/IPhone3D'
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '../StoreBadges/StoreBadges'
import './Hero.css'

const HERO_PHRASES = [
    { line1: 'O espaço certo,', line2: 'na hora certa.' },
    { line1: 'Trabalhe onde', line2: 'quiser, hoje.' },
    { line1: 'Reserve em', line2: 'segundos.' },
    { line1: 'Sua produtividade,', line2: 'sem contrato.' },
]

// O h1 é só a frase visível (sem cópia escondida, que o Google lia duplicada).
// Sem região aria-live: o leitor de tela lê a frase atual quando chega no título,
// sem ser interrompido a cada troca.
// Fica parado na primeira frase ("O espaço certo, na hora certa.") com
// prefers-reduced-motion e para robôs: o prerender do CI (Chrome automatizado,
// navigator.webdriver) esperava a rede ociosa por mais de 3,8s e gravava no HTML
// uma frase qualquer da rotação; buscadores que executam JS idem.
const isBot = () =>
    navigator.webdriver || /bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent)

function RotatingTitle() {
    const [index, setIndex] = useState(0)
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || isBot()) return
        let swap
        const interval = setInterval(() => {
            setVisible(false)
            swap = setTimeout(() => {
                setIndex(prev => (prev + 1) % HERO_PHRASES.length)
                setVisible(true)
            }, 450)
        }, 3800)
        return () => { clearInterval(interval); clearTimeout(swap) }
    }, [])

    const phrase = HERO_PHRASES[index]

    return (
        <h1 className="hero__title">
            <span className={`hero__phrase ${visible ? 'is-visible' : 'is-hidden'}`}>
                <span className="hero__l1">{phrase.line1}</span>{' '}
                <span className="hero__l2">{phrase.line2}</span>
            </span>
        </h1>
    )
}

export default function Hero() {
    return (
        <section className="hero" id="hero">
            <div className="container">
                <p className="home-label">Disponível para iOS e Android</p>

                <RotatingTitle />

                <div className="hero__grid">
                    <div className="hero__copy">
                        <p className="home-lead">
                            Encontre e reserve escritórios, clínicas, salões, estúdios e muito mais. Conectamos pessoas a espaços incríveis em todo o Brasil.
                        </p>
                        <div className="hero__cta-group">
                            <a href={APP_STORE_URL} className="btn btn-primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                                App Store
                            </a>
                            <a href={GOOGLE_PLAY_URL} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 20.5V3.5c0-.6.31-1.13.78-1.43L13.69 12l-9.9 9.94c-.47-.3-.79-.84-.79-1.44z"/><path d="M16.81 15.12L6.05 21.34l7.85-7.85 2.91 1.63z"/><path d="M20.16 10.81c.34.27.59.68.59 1.19s-.22.9-.59 1.19l-2.65 1.53-3.13-3.13 3.13-3.13 2.65 1.53z"/><path d="M6.05 2.66l10.76 6.22-2.91 2.91-7.85-7.85c.29-.16.63-.25.99-.25.34 0 .69.09 1.01.25z"/></svg>
                                Google Play
                            </a>
                        </div>
                        <ul className="hero__trust">
                            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Pagamento seguro</li>
                            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Confirmação imediata</li>
                            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Cancele quando quiser</li>
                        </ul>
                    </div>

                    <div className="hero__phone">
                        <IPhone3D screenshotSrc={screenshotSrc} />
                    </div>
                </div>

                <nav className="paths" aria-label="Escolha seu caminho">
                    <a className="path path--book" href="#spaces">
                        <span>
                            <small>Quero reservar</small>
                            <strong>Encontre um espaço por hora</strong>
                        </span>
                        <span className="path__arrow" aria-hidden="true">→</span>
                    </a>
                    <a className="path path--host on-ink" href="#hosts">
                        <span>
                            <small>Tenho um espaço</small>
                            <strong>Transforme horas vazias em receita</strong>
                        </span>
                        <span className="path__arrow" aria-hidden="true">→</span>
                    </a>
                </nav>
            </div>
        </section>
    )
}
