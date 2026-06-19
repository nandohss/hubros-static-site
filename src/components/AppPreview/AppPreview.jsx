import screenshotSrc from '../../assets/screenshot_marketplace.png'
import './AppPreview.css'

export default function AppPreview() {
    return (
        <section className="ap section" id="app-preview">
            <div className="container">
                <div className="ap__layout">

                    {/* ── Coluna esquerda — texto ── */}
                    <div className="ap__copy">
                        <div className="section-tag">O App em Ação</div>
                        <h2 className="section-title">
                            Encontre e reserve{' '}
                            <span className="text-gradient">com poucos toques</span>
                        </h2>
                        <p className="ap__desc">
                            No Hubros, você descobre espaços próximos, filtra pela categoria
                            ideal e vê o preço por hora ou dia — tudo antes de reservar.
                        </p>

                        <div className="ap__features">
                            <div className="ap__feat">
                                <div>
                                    <strong>Busca por região</strong>
                                    <p>Encontre espaços disponíveis perto de você em tempo real.</p>
                                </div>
                            </div>
                            <div className="ap__feat">
                                <div>
                                    <strong>Filtre por categoria</strong>
                                    <p>Saúde, coworking, eventos e muito mais.</p>
                                </div>
                            </div>
                            <div className="ap__feat">
                                <div>
                                    <strong>Preço transparente</strong>
                                    <p>Valor por hora ou dia antes de qualquer clique.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Coluna direita — iPhone 17 ── */}
                    <div className="ap__phone-wrap" aria-hidden="true">

                        {/* Botões físicos esquerda */}
                        <div className="ap__btn ap__btn--action" />
                        <div className="ap__btn ap__btn--vol-up" />
                        <div className="ap__btn ap__btn--vol-down" />
                        {/* Camera Control direita */}
                        <div className="ap__btn ap__btn--camera" />

                        {/* Corpo do iPhone */}
                        <div className="ap__phone">
                            {/* Screenshot ocupa todo o frame */}
                            <img
                                src={screenshotSrc}
                                alt="Tela do marketplace no app Hubros"
                                className="ap__screen"
                            />
                            {/* Dynamic Island sobreposto à tela */}
                            <div className="ap__dynamic-island" />
                        </div>

                        {/* Badges abaixo e ao lado do frame, sem tampar a tela */}
                        <div className="ap__badge ap__badge--left">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                            Reserva confirmada!
                        </div>
                        <div className="ap__badge ap__badge--right">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
                            R$ 20,00 / hora
                        </div>

                        <div className="ap__glow" />
                    </div>

                </div>
            </div>
        </section>
    )
}
