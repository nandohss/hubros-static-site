import { useState } from 'react'
import './Careers.css'

const AREAS = [
    'Tecnologia',
    'Produto e Design',
    'Comercial e Parcerias',
    'Marketing e Conteúdo',
    'Operações e Atendimento',
    'Outra área',
]

const INITIAL_FORM = { name: '', email: '', phone: '', area: '', link: '', message: '' }

export default function Careers() {
    const [form, setForm] = useState(INITIAL_FORM)
    const [status, setStatus] = useState('idle') // idle | sending | success | error

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('sending')
        try {
            const res = await fetch('https://formsubmit.co/ajax/contato@hubros.com.br', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    Nome: form.name,
                    Email: form.email,
                    WhatsApp: form.phone || '—',
                    'Área de interesse': form.area,
                    'LinkedIn ou portfólio': form.link || '—',
                    Mensagem: form.message,
                    _subject: `[Trabalhe Conosco] ${form.name} — ${form.area}`,
                    _captcha: 'false',
                    _template: 'table',
                }),
            })
            const data = await res.json()
            if (data.success === 'true' || data.success === true) {
                setStatus('success')
                window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
                setStatus('error')
            }
        } catch {
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <section className="careers-page" id="trabalhe-conosco">
                <div className="container careers-page__container">
                    <div className="careers-page__box careers-success">
                        <div className="careers-success__icon" aria-hidden="true">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h2 className="careers-success__title">Perfil recebido!</h2>
                        <p className="careers-success__text">
                            Obrigado pelo interesse na Hubros. Se surgir uma oportunidade com o seu perfil,
                            falamos com você em <strong>{form.email}</strong>.
                        </p>
                        <a href="/" className="btn btn-primary">Voltar ao site</a>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="careers-page" id="trabalhe-conosco">
            <div className="container careers-page__container">
                <div className="careers-page__header">
                    <div className="section-tag">Trabalhe Conosco</div>
                    <h1 className="careers-page__title">
                        Construa a <span className="text-gradient">Hubros</span> com a gente
                    </h1>
                    <p className="careers-page__subtitle">
                        Conte quem você é. Quando surgir uma oportunidade que combine com o seu perfil,
                        entramos em contato.
                    </p>
                </div>

                <div className="careers-page__box">
                    <form className="careers-form" onSubmit={handleSubmit}>
                        <div className="careers-form__row">
                            <div className="careers-form__group">
                                <label htmlFor="cw-name">Nome completo</label>
                                <input
                                    type="text" id="cw-name" name="name" required
                                    value={form.name} onChange={handleChange}
                                    placeholder="Seu nome"
                                    autoComplete="name"
                                />
                            </div>
                            <div className="careers-form__group">
                                <label htmlFor="cw-email">E-mail</label>
                                <input
                                    type="email" id="cw-email" name="email" required
                                    value={form.email} onChange={handleChange}
                                    placeholder="seu@email.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="careers-form__row">
                            <div className="careers-form__group">
                                <label htmlFor="cw-phone">
                                    WhatsApp <span className="careers-form__optional">(opcional)</span>
                                </label>
                                <input
                                    type="tel" id="cw-phone" name="phone"
                                    value={form.phone} onChange={handleChange}
                                    placeholder="(11) 99999-9999"
                                    autoComplete="tel"
                                />
                            </div>
                            <div className="careers-form__group">
                                <label htmlFor="cw-area">Área de interesse</label>
                                <select
                                    id="cw-area" name="area" required
                                    className="careers-form__select"
                                    value={form.area} onChange={handleChange}
                                >
                                    <option value="">Selecione</option>
                                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="careers-form__group">
                            <label htmlFor="cw-link">
                                LinkedIn ou portfólio <span className="careers-form__optional">(opcional)</span>
                            </label>
                            <input
                                type="text" id="cw-link" name="link" inputMode="url"
                                value={form.link} onChange={handleChange}
                                placeholder="linkedin.com/in/seu-perfil"
                            />
                        </div>

                        <div className="careers-form__group">
                            <label htmlFor="cw-message">Conte um pouco sobre você</label>
                            <textarea
                                id="cw-message" name="message" required rows="6"
                                value={form.message} onChange={handleChange}
                                placeholder="Sua experiência, o que você gostaria de fazer na Hubros..."
                            />
                        </div>

                        <label className="careers-form__consent">
                            <input type="checkbox" name="consent" required className="careers-form__check" />
                            <span>
                                Concordo que a Hubros use meus dados para avaliar minha candidatura e entrar em
                                contato. Saiba mais na{' '}
                                <a href="/privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>.
                            </span>
                        </label>

                        {status === 'error' && (
                            <p className="careers-form__error" role="alert">
                                Ocorreu um erro ao enviar. Tente novamente ou escreva para contato@hubros.com.br.
                            </p>
                        )}

                        <button
                            type="submit"
                            className="careers-form__button"
                            disabled={status === 'sending'}
                        >
                            {status === 'sending' ? 'Enviando...' : 'Enviar meu perfil'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
