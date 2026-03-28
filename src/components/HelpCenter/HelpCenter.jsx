import { useState } from 'react'
import './HelpCenter.css'

const INITIAL_FORM = { name: '', email: '', assunto: '', message: '' }

export default function HelpCenter() {
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
                    name: form.name,
                    email: form.email,
                    assunto_personalizado: form.assunto,
                    message: form.message,
                    _subject: `[Central de Ajuda] ${form.assunto}`,
                    _captcha: 'false',
                    _template: 'table',
                })
            })
            const data = await res.json()
            if (data.success === 'true' || data.success === true) {
                setStatus('success')
                setForm(INITIAL_FORM)
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
            <section className="help-center-page section" id="ajuda">
                <div className="container help-center-page__container">
                    <div className="help-center-page__box help-center-success">
                        <div className="help-center-success__icon">✅</div>
                        <h2 className="help-center-success__title">Mensagem enviada!</h2>
                        <p className="help-center-success__text">
                            Recebemos sua mensagem e entraremos em contato em breve pelo e-mail <strong>{form.email || 'informado'}</strong>.
                        </p>
                        <button
                            className="help-center-form__button"
                            onClick={() => setStatus('idle')}
                        >
                            Enviar outra mensagem
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="help-center-page section" id="ajuda">
            <div className="container help-center-page__container">
                <div className="help-center-page__header">
                    <div className="section-tag">🎧 Central de Ajuda</div>
                    <h2 className="help-center-page__title">
                        Como podemos <span className="text-gradient">ajudar?</span>
                    </h2>
                    <p className="help-center-page__subtitle">
                        Preencha o formulário e nossa equipe entrará em contato em breve.
                    </p>
                </div>

                <div className="help-center-page__box">
                    <form className="help-center-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Nome Completo</label>
                                <input
                                    type="text" id="name" name="name" required
                                    value={form.name} onChange={handleChange}
                                    placeholder="Ex: João da Silva"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">E-mail de Contato</label>
                                <input
                                    type="email" id="email" name="email" required
                                    value={form.email} onChange={handleChange}
                                    placeholder="Ex: joao@email.com"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="assunto">Assunto</label>
                            <input
                                type="text" id="assunto" name="assunto" required
                                value={form.assunto} onChange={handleChange}
                                placeholder="Ex: Dúvida sobre reserva de mesa"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Mensagem</label>
                            <textarea
                                id="message" name="message" required
                                rows="7"
                                value={form.message} onChange={handleChange}
                                placeholder="Como podemos te ajudar?"
                            />
                        </div>

                        {status === 'error' && (
                            <p className="help-center-form__error">
                                Ocorreu um erro ao enviar. Tente novamente ou escreva para contato@hubros.com.br.
                            </p>
                        )}

                        <button
                            type="submit"
                            className="help-center-form__button"
                            disabled={status === 'sending'}
                        >
                            {status === 'sending' ? 'Enviando...' : 'Enviar Mensagem'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
