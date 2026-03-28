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
                            🔔 Reserva confirmada!
                        </div>
                        <div className="ap__badge ap__badge--right">
                            💰 R$ 20,00 / hora
                        </div>

                        <div className="ap__glow" />
                    </div>

                </div>
            </div>
        </section>
    )
}
