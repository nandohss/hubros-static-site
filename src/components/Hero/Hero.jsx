import './Hero.css'

export default function Hero() {
    return (
        <section className="hero" id="hero">
            {/* Glow de fundo */}
            <div className="hero__glow" aria-hidden="true" />
            <div className="hero__glow hero__glow--2" aria-hidden="true" />

            <div className="container hero__inner">
                <div className="hero__content">
                    <div className="section-tag">
                        <span>🚀</span> Lançamento — Disponível na App Store
                    </div>

                    <h1 className="hero__title">
                        Seu próximo escritório{' '}
                        <span className="text-gradient">está a um clique</span>{' '}
                        de distância
                    </h1>

                    <p className="hero__subtitle">
                        Encontre, reserve e trabalhe em espaços incríveis de coworking.
                        Conectamos profissionais a espaços únicos em todo o país.
                    </p>

                    <div className="hero__actions">
                        <a href="#download" className="btn btn-primary btn-lg" id="hero-cta-appstore">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                            </svg>
                            App Store
                        </a>
                        <a href="#download" className="btn btn-secondary btn-lg" id="hero-cta-googleplay">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3.18 23.76c.38.21.82.22 1.22.04l11.64-6.57-2.55-2.55-10.31 9.08zM.5 1.98C.18 2.33 0 2.88 0 3.6v16.8c0 .72.18 1.27.51 1.62l.08.08 9.41-9.41v-.22L.58 1.9l-.08.08zM20.49 10.14l-2.64-1.49-2.87 2.87 2.87 2.87 2.65-1.5c.76-.43.76-1.32-.01-1.75zM4.4.24L16.04 6.81l-2.55 2.55L3.18.28C3.58.1 4.02.11 4.4.24z" />
                            </svg>
                            Google Play
                        </a>
                    </div>
                </div>

                {/* QR Code + visual */}
                <div className="hero__visual" aria-hidden="false">
                    <div className="hero__qr-card">
                        <p className="hero__qr-label">Escaneie para baixar</p>
                        {/* QR Code representativo */}
                        <div className="hero__qr-frame">
                            <svg
                                viewBox="0 0 200 200"
                                xmlns="http://www.w3.org/2000/svg"
                                className="hero__qr-svg"
                            >
                                {/* Fundo branco */}
                                <rect width="200" height="200" fill="white" rx="12" />
                                {/* Módulos do QR — padrão de marcadores de posição */}
                                {/* Canto superior esquerdo */}
                                <rect x="10" y="10" width="56" height="56" rx="4" fill="black" />
                                <rect x="18" y="18" width="40" height="40" rx="2" fill="white" />
                                <rect x="26" y="26" width="24" height="24" rx="1" fill="black" />
                                {/* Canto superior direito */}
                                <rect x="134" y="10" width="56" height="56" rx="4" fill="black" />
                                <rect x="142" y="18" width="40" height="40" rx="2" fill="white" />
                                <rect x="150" y="26" width="24" height="24" rx="1" fill="black" />
                                {/* Canto inferior esquerdo */}
                                <rect x="10" y="134" width="56" height="56" rx="4" fill="black" />
                                <rect x="18" y="142" width="40" height="40" rx="2" fill="white" />
                                <rect x="26" y="150" width="24" height="24" rx="1" fill="black" />
                                {/* Módulos de dados centrais */}
                                <rect x="76" y="10" width="8" height="8" fill="black" />
                                <rect x="92" y="10" width="8" height="8" fill="black" />
                                <rect x="108" y="10" width="8" height="8" fill="black" />
                                <rect x="124" y="10" width="8" height="8" fill="black" />
                                <rect x="76" y="26" width="8" height="8" fill="black" />
                                <rect x="108" y="26" width="8" height="8" fill="black" />
                                <rect x="76" y="42" width="8" height="8" fill="black" />
                                <rect x="92" y="42" width="8" height="8" fill="black" />
                                <rect x="124" y="42" width="8" height="8" fill="black" />
                                <rect x="76" y="58" width="8" height="8" fill="black" />
                                <rect x="108" y="58" width="8" height="8" fill="black" />
                                {/* Coluna central esquerda */}
                                <rect x="10" y="76" width="8" height="8" fill="black" />
                                <rect x="26" y="76" width="8" height="8" fill="black" />
                                <rect x="58" y="76" width="8" height="8" fill="black" />
                                <rect x="76" y="76" width="8" height="8" fill="black" />
                                <rect x="92" y="76" width="8" height="8" fill="black" />
                                <rect x="108" y="76" width="8" height="8" fill="black" />
                                <rect x="124" y="76" width="8" height="8" fill="black" />
                                <rect x="140" y="76" width="8" height="8" fill="black" />
                                <rect x="156" y="76" width="8" height="8" fill="black" />
                                <rect x="182" y="76" width="8" height="8" fill="black" />
                                {/* Bloco central */}
                                <rect x="76" y="92" width="8" height="8" fill="black" />
                                <rect x="108" y="92" width="8" height="8" fill="black" />
                                <rect x="124" y="92" width="8" height="8" fill="black" />
                                <rect x="156" y="92" width="8" height="8" fill="black" />
                                <rect x="76" y="108" width="8" height="8" fill="black" />
                                <rect x="92" y="108" width="8" height="8" fill="black" />
                                <rect x="140" y="108" width="8" height="8" fill="black" />
                                <rect x="172" y="108" width="8" height="8" fill="black" />
                                <rect x="76" y="124" width="8" height="8" fill="black" />
                                <rect x="108" y="124" width="8" height="8" fill="black" />
                                <rect x="124" y="124" width="8" height="8" fill="black" />
                                <rect x="156" y="124" width="8" height="8" fill="black" />
                                <rect x="76" y="140" width="8" height="8" fill="black" />
                                <rect x="92" y="140" width="8" height="8" fill="black" />
                                <rect x="108" y="140" width="8" height="8" fill="black" />
                                <rect x="140" y="140" width="8" height="8" fill="black" />
                                <rect x="172" y="140" width="8" height="8" fill="black" />
                                <rect x="76" y="156" width="8" height="8" fill="black" />
                                <rect x="124" y="156" width="8" height="8" fill="black" />
                                <rect x="140" y="156" width="8" height="8" fill="black" />
                                <rect x="156" y="156" width="8" height="8" fill="black" />
                                <rect x="76" y="172" width="8" height="8" fill="black" />
                                <rect x="92" y="172" width="8" height="8" fill="black" />
                                <rect x="108" y="172" width="8" height="8" fill="black" />
                                <rect x="124" y="172" width="8" height="8" fill="black" />
                                <rect x="172" y="172" width="8" height="8" fill="black" />
                                <rect x="76" y="188" width="8" height="8" fill="black" />
                                <rect x="108" y="188" width="8" height="8" fill="black" />
                                <rect x="156" y="188" width="8" height="8" fill="black" />
                            </svg>
                        </div>
                        <p className="hero__qr-sublabel">Disponível para iOS e Android</p>
                        <div className="hero__qr-badges">
                            <img
                                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                alt="App Store"
                                className="hero__qr-store-badge"
                            />
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                alt="Google Play"
                                className="hero__qr-store-badge"
                            />
                        </div>
                    </div>
                    {/* orbs decorativos */}
                    <div className="hero__orb hero__orb--1" />
                    <div className="hero__orb hero__orb--2" />
                </div>
            </div>

            {/* Wave */}
            <div className="hero__wave" aria-hidden="true">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,80 L0,80 Z" fill="#111111" />
                </svg>
            </div>
        </section>
    )
}
