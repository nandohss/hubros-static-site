import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './Waitlist.css'

const spaceTypes = [
    'Escritório / Coworking',
    'Consultório / Clínica',
    'Estúdio Fotográfico',
    'Salão de Beleza',
    'Sala Multiuso',
    'Outro',
]

function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}

function BuildingIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h1M14 9h1M9 14h1M14 14h1M9 19v-1M15 19v-1" />
        </svg>
    )
}

function SearchIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
        </svg>
    )
}

const APP_STORE_URL = 'https://apps.apple.com/br/app/hubros/id6762576263'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=br.com.hubros.hubros_app'

function AppleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
    )
}

function PlayIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 20.5V3.5c0-.6.31-1.13.78-1.43L13.69 12l-9.9 9.94c-.47-.3-.79-.84-.79-1.44z" />
            <path d="M16.81 15.12L6.05 21.34l7.85-7.85 2.91 1.63z" />
            <path d="M20.16 10.81c.34.27.59.68.59 1.19s-.22.9-.59 1.19l-2.65 1.53-3.13-3.13 3.13-3.13 2.65 1.53z" />
            <path d="M6.05 2.66l10.76 6.22-2.91 2.91-7.85-7.85c.29-.16.63-.25.99-.25.34 0 .69.09 1.01.25z" />
        </svg>
    )
}

// 00.000.000/0000-00 — formata conforme digita e ignora o que não for dígito.
function maskCNPJ(value) {
    const d = value.replace(/\D/g, '').slice(0, 14)
    return d
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
}

export default function Waitlist() {
    const [searchParams] = useSearchParams()
    const initialRole = searchParams.get('role') === 'host' ? 'host' : ''
    const [role, setRole] = useState(initialRole)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    // A tela é compartilhada entre host (cadastro imediato — app já está no ar
    // e coworkings já sendo ativados) e coworker (ainda em lista de espera por
    // região). Só o texto do lado host mudou aqui: não temos confirmação de
    // que a cobertura para quem busca espaço já está completa em toda região.
    const isHost = role === 'host'
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        spaceName: '',
        cnpj: '',
        spaceType: '',
        city: '',
        neighborhood: '',
        message: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: name === 'cnpj' ? maskCNPJ(value) : value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await fetch('https://formsubmit.co/ajax/contato@hubros.com.br', {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Perfil: role === 'host' ? 'Anfitrião' : 'Usuário',
                    Nome: form.name,
                    Email: form.email,
                    WhatsApp: form.phone,
                    Cidade: form.city,
                    ...(role === 'host' && {
                        'Nome do coworking': form.spaceName,
                        CNPJ: form.cnpj || '—',
                    }),
                    Bairro: form.neighborhood || '—',
                    'Tipo de espaço': form.spaceType || '—',
                    Mensagem: form.message || '—',
                    _subject: `[Hubros] ${role === 'host' ? 'Pedido de ajuda — cadastro de coworking' : 'Nova entrada na lista de espera'}`,
                }),
            })
            const data = await res.json()
            if (data.success === 'true' || data.success === true) {
                setSubmitted(true)
            } else {
                setError('Algo deu errado. Tente novamente.')
            }
        } catch {
            setError('Erro de conexão. Verifique sua internet e tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="wl-page">
            <main className="wl-main">

                {submitted ? (
                    <div className="wl-success">
                        <div className="wl-success__icon"><CheckIcon /></div>
                        <h1 className="wl-success__title">{isHost ? 'Recebemos seu contato!' : 'Você está na lista!'}</h1>
                        <p className="wl-success__sub">
                            {isHost
                                ? 'Nossa equipe vai entrar em contato para te ajudar com o cadastro do seu coworking.'
                                : 'Entraremos em contato assim que abrirmos sua região. Obrigado por fazer parte do começo da Hubros.'}
                        </p>
                        <a href="/" className="btn btn-primary">Voltar ao site</a>
                    </div>
                ) : (
                    <div className="wl-card">
                        <div className="wl-card__header">
                            <div className="section-tag">{isHost ? 'Fale com a Gente' : 'Lista de Espera'}</div>
                            <h1 className="wl-card__title">
                                {isHost ? (
                                    <>Tire suas dúvidas<br /><span className="text-gradient">sobre o cadastro</span></>
                                ) : (
                                    <>Faça parte da<br /><span className="text-gradient">base inicial</span></>
                                )}
                            </h1>
                            <p className="wl-card__sub">
                                {isHost
                                    ? 'Preencha o formulário abaixo e nossa equipe entra em contato para te ajudar.'
                                    : 'Estamos construindo a Hubros junto com quem vai usá-la. Preencha abaixo e te avisamos quando chegar a sua vez.'}
                            </p>
                        </div>

                        {isHost && (
                            <div className="wl-app-note">
                                <p className="wl-app-note__text">
                                    <strong>O cadastro do seu coworking já pode ser feito direto no app Hubros.</strong>{' '}
                                    Este formulário é opcional — use se quiser ajuda da nossa equipe ou tiver alguma dúvida.
                                </p>
                                <div className="wl-app-note__stores">
                                    <a href={APP_STORE_URL} className="btn btn-secondary wl-app-note__store" target="_blank" rel="noopener noreferrer">
                                        <AppleIcon /> App Store
                                    </a>
                                    <a href={PLAY_STORE_URL} className="btn btn-secondary wl-app-note__store" target="_blank" rel="noopener noreferrer">
                                        <PlayIcon /> Google Play
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Role selector */}
                        <div className="wl-role">
                            <button
                                type="button"
                                className={`wl-role__btn ${role === 'host' ? 'wl-role__btn--active' : role !== '' ? 'wl-role__btn--inactive' : ''}`}
                                onClick={() => setRole('host')}
                            >
                                <span className="wl-role__check" aria-hidden="true">
                                    {role === 'host' && <CheckIcon />}
                                </span>
                                <span className="wl-role__icon-wrap">
                                    <BuildingIcon />
                                </span>
                                <span className="wl-role__label">Tenho um espaço</span>
                                <span className="wl-role__desc">Preciso de ajuda com meu coworking</span>
                            </button>
                            <button
                                type="button"
                                className={`wl-role__btn ${role === 'user' ? 'wl-role__btn--active' : role !== '' ? 'wl-role__btn--inactive' : ''}`}
                                onClick={() => setRole('user')}
                            >
                                <span className="wl-role__check" aria-hidden="true">
                                    {role === 'user' && <CheckIcon />}
                                </span>
                                <span className="wl-role__icon-wrap">
                                    <SearchIcon />
                                </span>
                                <span className="wl-role__label">Quero usar espaços</span>
                                <span className="wl-role__desc">Busco flexibilidade sem custo fixo</span>
                            </button>
                        </div>

                        {role && (
                            <form className="wl-form" onSubmit={handleSubmit}>
                                <div className="wl-form__row">
                                    <div className="wl-form__field">
                                        <label className="wl-form__label" htmlFor="name">Nome completo</label>
                                        <input
                                            id="name" name="name" type="text"
                                            className="wl-form__input"
                                            placeholder="Seu nome"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="wl-form__field">
                                        <label className="wl-form__label" htmlFor="email">E-mail</label>
                                        <input
                                            id="email" name="email" type="email"
                                            className="wl-form__input"
                                            placeholder="seu@email.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="wl-form__row">
                                    <div className="wl-form__field">
                                        <label className="wl-form__label" htmlFor="phone">WhatsApp</label>
                                        <input
                                            id="phone" name="phone" type="tel"
                                            className="wl-form__input"
                                            placeholder="(11) 99999-9999"
                                            value={form.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="wl-form__field">
                                        <label className="wl-form__label" htmlFor="city">Cidade</label>
                                        <input
                                            id="city" name="city" type="text"
                                            className="wl-form__input"
                                            placeholder="São Paulo"
                                            value={form.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {role === 'host' && (
                                    <>
                                        <div className="wl-form__row">
                                            <div className="wl-form__field">
                                                <label className="wl-form__label" htmlFor="spaceName">Nome do coworking</label>
                                                <input
                                                    id="spaceName" name="spaceName" type="text"
                                                    className="wl-form__input"
                                                    placeholder="Como seu espaço se chama"
                                                    value={form.spaceName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="wl-form__field">
                                                <label className="wl-form__label" htmlFor="cnpj">CNPJ <span className="wl-form__optional">(opcional)</span></label>
                                                <input
                                                    id="cnpj" name="cnpj" type="text"
                                                    className="wl-form__input"
                                                    placeholder="00.000.000/0000-00"
                                                    value={form.cnpj}
                                                    onChange={handleChange}
                                                    inputMode="numeric"
                                                    maxLength={18}
                                                />
                                            </div>
                                        </div>

                                        <div className="wl-form__row">
                                            <div className="wl-form__field">
                                                <label className="wl-form__label" htmlFor="neighborhood">Bairro</label>
                                                <input
                                                    id="neighborhood" name="neighborhood" type="text"
                                                    className="wl-form__input"
                                                    placeholder="Ex: Pinheiros"
                                                    value={form.neighborhood}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="wl-form__field">
                                                <label className="wl-form__label" htmlFor="spaceType">Tipo de espaço</label>
                                                <select
                                                    id="spaceType" name="spaceType"
                                                    className="wl-form__input wl-form__select"
                                                    value={form.spaceType}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Selecione</option>
                                                    {spaceTypes.map(t => (
                                                        <option key={t} value={t}>{t}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="wl-form__field">
                                            <label className="wl-form__label" htmlFor="message">Conte um pouco sobre seu espaço <span className="wl-form__optional">(opcional)</span></label>
                                            <textarea
                                                id="message" name="message"
                                                className="wl-form__input wl-form__textarea"
                                                placeholder="Quantas salas, capacidade, horários disponíveis..."
                                                value={form.message}
                                                onChange={handleChange}
                                                rows={3}
                                            />
                                        </div>
                                    </>
                                )}

                                {role === 'user' && (
                                    <div className="wl-form__field">
                                        <label className="wl-form__label" htmlFor="spaceType">Que tipo de espaço você busca?</label>
                                        <select
                                            id="spaceType" name="spaceType"
                                            className="wl-form__input wl-form__select"
                                            value={form.spaceType}
                                            onChange={handleChange}
                                        >
                                            <option value="">Selecione uma categoria</option>
                                            {spaceTypes.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <label className="wl-form__consent">
                                    <input type="checkbox" name="consent" required className="wl-form__consent-check" />
                                    <span>
                                        Concordo em receber comunicações da Hubros sobre o lançamento, novidades e ofertas exclusivas. Você pode cancelar a qualquer momento.
                                    </span>
                                </label>

                                {error && <p className="wl-form__error">{error}</p>}

                                <button type="submit" className="btn btn-primary wl-form__submit" disabled={loading}>
                                    {loading ? 'Enviando...' : isHost ? 'Quero falar com a equipe' : 'Entrar na lista de espera'}
                                    {!loading && (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </button>

                                <p className="wl-form__disclaimer">
                                    {isHost
                                        ? 'Sem spam. Só entramos em contato pra te ajudar com o cadastro.'
                                        : 'Sem spam. Apenas avisamos quando abrirmos a sua região.'}
                                </p>
                            </form>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
