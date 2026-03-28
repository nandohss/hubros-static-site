import { useScrollReveal } from '../../hooks/useScrollReveal'
import './About.css'

export default function About() {
    const revealRef = useScrollReveal({ threshold: 0.1 });

    return (
        <div className="about-page" ref={revealRef}>
            <div className="container">
                {/* Hero Section */}
                <section className="about__hero reveal">
                    <h1 className="section-title">
                        Redefinindo o conceito de <span className="text-gradient">espaço de trabalho.</span>
                    </h1>
                    <p className="about__hero-subtitle">
                        A Hubros nasceu para conectar profissionais independentes e empresas a ambientes inspiradores de forma rápida, flexível e sem burocracia.
                    </p>
                </section>

                {/* Nossa Visão */}
                <section className="about__vision reveal" style={{ transitionDelay: '0.1s' }}>
                    <div className="about__vision-content">
                        <h3>O Futuro é Compartilhado</h3>
                        <p className="about__vision-text">
                            Ser um profissional autônomo ou iniciar uma pequena empresa sempre envolveu um grande dilema: arcar com os <span className="about__vision-highlight">altos custos fixos</span> de um aluguel comercial (luz, internet, condomínio, burocracias pesadas) ou sacrificar a imagem profissional improvisando atendimentos.
                        </p>
                        <p className="about__vision-text">
                            Do outro lado do balcão, percebemos que clínicas, estúdios e escritórios passam horas — ou até dias — completamente vazios e sofrendo com a ociosidade, gerando prejuízo contínuo para seus proprietários.
                        </p>
                        <p className="about__vision-text">
                            A <span className="about__vision-highlight">Hubros</span> nasceu justamente para resolver esse desequilíbrio. Através da economia compartilhada, transformamos espaços ociosos em oportunidades reais. Democratizamos o acesso a infraestruturas premium para quem precisa trabalhar ou atender, pagando estritamente pelo tempo que usar.
                        </p>
                        <p className="about__vision-text">
                            É um ecossistema inteligente onde todos ganham: profissionais e empresas podem reduzir seus custos fixos em até 80%, e o anfitrião transforma um espaço vazio em uma nova, segura e constante fonte de renda.
                        </p>
                    </div>
                </section>

                {/* Pilares */}
                <section className="about__pillars">
                    <div className="about__pillars-header reveal" style={{ transitionDelay: '0.2s' }}>
                        <div className="section-tag">Nossos Pilares</div>
                        <h2 className="section-title">O que nos move</h2>
                    </div>
                    
                    <div className="about__pillars-grid">
                        <div className="about__pillar-card card reveal" style={{ '--accent': 'rgba(255,255,255,0.15)', transitionDelay: '0.3s' }}>
                            <h3 className="about__pillar-title">Flexibilidade Total</h3>
                            <p className="about__pillar-desc">
                                Sem contratos longos ou multas rescisórias. Trabalhe de onde quiser e pague livremente apenas pelo tempo que de fato utilizar o espaço.
                            </p>
                        </div>

                        <div className="about__pillar-card card reveal" style={{ '--accent': 'rgba(255,255,255,0.12)', transitionDelay: '0.4s' }}>
                            <h3 className="about__pillar-title">Inovação no Fluxo</h3>
                            <p className="about__pillar-desc">
                                Oferecemos uma experiência de reserva e busca instantânea, inteligente e 100% digital, pensada meticulosamente para economizar o seu tempo.
                            </p>
                        </div>

                        <div className="about__pillar-card card reveal" style={{ '--accent': 'rgba(255,255,255,0.18)', transitionDelay: '0.5s' }}>
                            <h3 className="about__pillar-title">Comunidade Forte</h3>
                            <p className="about__pillar-desc">
                                Mais que um app, criamos conexões reais. Somos a ponte que une necessidades criativas aos ambientes mais bem equipados da cidade.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Statement Moderno */}
                <section className="about__statement reveal" style={{ transitionDelay: '0.6s' }}>
                    <div className="about__statement-content">
                        <h2>Faça parte do <br/><span className="text-gradient">futuro do trabalho.</span></h2>
                        <div className="about__statement-line"></div>
                        <p>
                            Seja você um profissional ou uma equipe buscando o seu próximo palco, ou um anfitrião pronto para abrir suas portas. A Hubros é o ecossistema inovador feito para quem busca a liberdade de evoluir.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}
