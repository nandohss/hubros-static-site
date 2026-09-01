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
                    _subject: `[Hubros] Nova entrada na lista de espera — ${role === 'host' ? 'Anfitrião' : 'Usuário'}`,
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
                        <h1 className="wl-success__title">Você está na lista!</h1>
                        <p className="wl-success__sub">
                            Entraremos em contato assim que abrirmos sua região.
                            Obrigado por fazer parte do começo da Hubros.
                        </p>
                        <a href="/" className="btn btn-primary">Voltar ao site</a>
                    </div>
                ) : (
                    <div className="wl-card">
                        <div className="wl-card__header">
                            <div className="section-tag">Lista de Espera</div>
                            <h1 className="wl-card__title">
                                Faça parte da<br />
                                <span className="text-gradient">base inicial</span>
                            </h1>
                            <p className="wl-card__sub">
                                Estamos construindo a Hubros junto com quem vai usá-la.
                                Preencha abaixo e te avisamos quando chegar a sua vez.
                            </p>
                        </div>

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
                                <span className="wl-role__desc">Quero cadastrar e monetizar</span>
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
                                    {loading ? 'Enviando...' : role === 'host' ? 'Garantir minha vaga como host' : 'Entrar na lista de espera'}
                                    {!loading && (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </button>

                                <p className="wl-form__disclaimer">
                                    Sem spam. Apenas avisamos quando abrirmos a sua região.
                                </p>
                            </form>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
