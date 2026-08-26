import { useState, useEffect, useRef } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import './ForHosts.css'

const perks = [
    'Cadastro gratuito e configuração em minutos',
    'Controle total de preços, horários e disponibilidade',
    'Receba automaticamente via Pix ou transferência bancária',
    'Dashboard completo com visão de receitas e ocupação',
]

function useInView(threshold = 0.25) {
    const ref = useRef(null)
    const [inView, setInView] = useState(false)
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true) },
            { threshold }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [threshold])
    return [ref, inView]
}

function CountUp({ to, prefix = '', suffix = '', duration = 1400, decimals = 0 }) {
    const [ref, inView] = useInView()
    const [val, setVal] = useState(0)
    useEffect(() => {
        if (!inView) return
        let current = 0
        const steps = 60
        const increment = to / steps
        const interval = duration / steps
        const timer = setInterval(() => {
            current += increment
            if (current >= to) {
                setVal(to)
                clearInterval(timer)
            } else {
                setVal(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current))
            }
        }, interval)
        return () => clearInterval(timer)
    }, [inView, to, duration, decimals])

    const formatted = decimals > 0
        ? val.toLocaleString('pt-BR', { minimumFractionDigits: decimals })
        : val.toLocaleString('pt-BR')

    return <span ref={ref}>{prefix}{formatted}{suffix}</span>
}

function AnimatedBar({ label, percentage, delay = 0 }) {
    const [ref, inView] = useInView()
    
    return (
        <div className="metric-chart-item" ref={ref}>
            <div className="metric-chart-header">
                <span>{label}</span>
                <span>{inView ? <CountUp to={percentage} duration={1200} suffix="%" /> : '0%'}</span>
            </div>
            <div className="metric-chart-bg">
                <div 
                    className="metric-chart-fill" 
                    style={{ 
                        width: inView ? `${percentage}%` : '0%',
                        transition: `width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`
                    }}
                ></div>
            </div>
        </div>
    )
}

export default function ForHosts() {
    const revealRef = useScrollReveal({ threshold: 0.1 })

    return (
        <section className="forhosts section" id="hosts">
            <div className="container" ref={revealRef}>
                <div className="forhosts-grid">
                    {/* Left — copy */}
                    <div className="forhosts-content reveal">
                        <div className="section-tag">Para Hosts</div>
                        <h2 className="forhosts-title">
                            Transforme espaço ocioso<br />
                            em renda recorrente
                        </h2>
                        <p className="forhosts-desc">
                            Clínicas, escritórios, estúdios e salões ficam vazios horas por dia.
                            Na Hubros, cada hora vazia vira oportunidade real de receita — sem esforço.
                        </p>
                        <ul className="forhosts-list">
                            {perks.map((perk, i) => (
                                <li key={i}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    {perk}
                                </li>
                            ))}
                        </ul>
                        <a href="/lista-de-espera?role=host" className="btn btn-secondary" style={{ marginTop: '16px', background: '#FFFFFF', color: 'var(--color-text-primary)', border: 'none' }}>
                            Quero cadastrar meu espaço
                        </a>
                    </div>

                    {/* Right — metrics */}
                    <div className="forhosts-metrics">
                        <div className="metric-card reveal" style={{ transitionDelay: '0.2s' }}>
                            <div className="metric-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                            </div>
                            <div className="metric-value">
                                R$ <CountUp to={3200} duration={1600} />
                            </div>
                            <div className="metric-label">Receita média/mês por host</div>
                        </div>

                        <div className="metric-card reveal" style={{ transitionDelay: '0.3s' }}>
                            <div className="metric-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </div>
                            <div className="metric-value">
                                até <CountUp to={80} duration={1200} suffix="%" />
                            </div>
                            <div className="metric-label">De redução na ociosidade</div>
                        </div>

                        <div className="metric-card reveal" style={{ transitionDelay: '0.4s' }}>
                            <div className="metric-chart-title">Taxa de ocupação por categoria</div>
                            
                            <AnimatedBar label="Escritórios" percentage={74} delay={0.2} />
                            <AnimatedBar label="Clínicas" percentage={68} delay={0.4} />
                            <AnimatedBar label="Salões" percentage={61} delay={0.6} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
