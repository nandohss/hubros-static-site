import { cloneElement, useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import StoreBadges from '../StoreBadges/StoreBadges'
import './HostSignup.css'
import {
    COGNITO_REGION, COGNITO_WEB_CLIENT_ID, HOST_SIGNUP_ENABLED, TURNSTILE_SITE_KEY,
} from '../../config/hostSignup'
import { confirmSignUp, resendConfirmationCode, signUp } from '../../lib/cognito'
import { trackPixel } from '../../lib/metaPixel'
import {
    AMBIENTES, CATEGORIES, FIELD_LIMITS, SUBCATEGORIES, UFS, buildSignUpRequest, lookupCep, mapAuthError, maskCep, maskPhone,
    normalizeEmail, validateAccountStep, validateSpaceStep,
} from '../../lib/hostSignup'

const WAITLIST_URL = '/lista-de-espera/?role=host'
const RESEND_COOLDOWN_SECONDS = 30
const STEPS = ['Seu espaço', 'Sua conta', 'Confirmação']

const EMPTY_FORM = {
    name: '', categoria: '', subcategoria: '', ambiente: '', zipCode: '', street: '', number: '', complement: '', district: '',
    city: '', state: '', fullName: '', email: '', phone: '', password: '', acceptTerms: false,
}

// O erro fica ligado ao campo (aria-invalid + aria-describedby) para o leitor de tela anunciar.
function Field({ id, label, error, optional, hint, className = '', children }) {
    const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
    return (
        <div className={`hs-field ${className}`}>
            <label className="hs-label" htmlFor={id}>
                {label}{optional && <> <span className="hs-optional">(opcional)</span></>}
            </label>
            {cloneElement(children, { 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
            {hint && <div id={`${id}-hint`} className="hs-hint">{hint}</div>}
            {error && <p id={`${id}-error`} className="hs-field-error" role="alert">{error}</p>}
        </div>
    )
}

function StepHeader({ title, sub }) {
    return (
        <header className="hs-head">
            <p className="home-label hs-head__label">Cadastre seu espaço</p>
            <h1 className="hs-title">{title}</h1>
            {sub && <p className="hs-sub">{sub}</p>}
        </header>
    )
}

function useTurnstile(active, setToken) {
    const containerRef = useRef(null)
    useEffect(() => {
        if (!TURNSTILE_SITE_KEY || !active) return undefined
        let widgetId = null
        let cancelled = false
        const loadScript = () => new Promise((resolve) => {
            if (window.turnstile) return resolve(window.turnstile)
            const script = document.createElement('script')
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
            script.async = true
            script.onload = () => resolve(window.turnstile)
            document.head.appendChild(script)
            return undefined
        })
        loadScript().then((turnstile) => {
            if (cancelled || !containerRef.current) return
            widgetId = turnstile.render(containerRef.current, {
                sitekey: TURNSTILE_SITE_KEY,
                callback: setToken,
                'expired-callback': () => setToken(''),
                'error-callback': () => setToken(''),
            })
        })
        return () => {
            cancelled = true
            try { if (widgetId !== null) window.turnstile.remove(widgetId) } catch { /* já removido */ }
        }
    }, [active, setToken])
    return containerRef
}

function HostSignupForm() {
    const [step, setStep] = useState('space') // space | account | code | done | exists
    const [form, setForm] = useState(EMPTY_FORM)
    const [errors, setErrors] = useState({})
    const [apiError, setApiError] = useState('')
    const [notice, setNotice] = useState('')
    const [loading, setLoading] = useState(false)
    const [cepStatus, setCepStatus] = useState('') // loading | ok | notfound
    const [code, setCode] = useState('')
    const [confirmedHere, setConfirmedHere] = useState(false)
    const [cooldown, setCooldown] = useState(0)
    const [turnstileToken, setTurnstileToken] = useState('')
    const turnstileRef = useTurnstile(step === 'account', setTurnstileToken)

    const clientOptions = { region: COGNITO_REGION }
    const email = normalizeEmail(form.email)

    useEffect(() => {
        if (cooldown <= 0) return undefined
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
        return () => clearTimeout(timer)
    }, [cooldown])

    useEffect(() => { window.scrollTo(0, 0) }, [step])

    const update = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
    }
    // Trocar a categoria invalida a subcategoria escolhida (cada categoria tem as suas).
    const onCategoriaChange = (event) => {
        update('categoria', event.target.value)
        update('subcategoria', '')
    }
    const onChange = (event) => {
        const { name, value, type, checked } = event.target
        update(name, type === 'checkbox' ? checked : value)
    }

    const onCepChange = async (event) => {
        const masked = maskCep(event.target.value)
        update('zipCode', masked)
        if (masked.length !== 9) { setCepStatus(''); return }
        setCepStatus('loading')
        const address = await lookupCep(masked)
        if (!address) { setCepStatus('notfound'); return }
        setCepStatus('ok')
        // Preenche o que o ViaCEP trouxe; o que vier vazio (CEP genérico) o usuário completa.
        setForm((prev) => ({
            ...prev,
            street: address.street || prev.street,
            district: address.district || prev.district,
            city: address.city || prev.city,
            state: address.state || prev.state,
        }))
        // O preenchimento automático troca os valores sem passar por `update`: limpa os
        // avisos antigos de endereço, senão "Informe a rua" fica ao lado da rua preenchida.
        setErrors((prev) => ({
            ...prev, zipCode: undefined, street: undefined, district: undefined, city: undefined, state: undefined,
        }))
    }

    const goToAccount = (event) => {
        event.preventDefault()
        const found = validateSpaceStep(form)
        setErrors(found)
        if (Object.keys(found).length === 0) { setApiError(''); setStep('account') }
    }

    const handleSignUp = async (event) => {
        event.preventDefault()
        const found = validateAccountStep(form)
        setErrors(found)
        if (Object.keys(found).length > 0) return
        if (TURNSTILE_SITE_KEY && !turnstileToken) {
            setApiError('Confirme a verificação de segurança antes de continuar.')
            return
        }
        setLoading(true)
        setApiError('')
        try {
            const request = buildSignUpRequest({ clientId: COGNITO_WEB_CLIENT_ID, form, turnstileToken })
            await signUp(request, clientOptions)
            trackPixel('Lead', { content_name: 'cadastro-host' })
            setNotice(`Enviamos um código de 6 dígitos para ${email}.`)
            setCooldown(RESEND_COOLDOWN_SECONDS)
            setStep('code')
        } catch (error) {
            await handleSignUpError(error)
        } finally {
            setLoading(false)
        }
    }

    // E-mail que já existe: NÃO dá para saber, pelo site, se a conta está confirmada. O Cognito manda
    // um código mesmo para conta já confirmada e responde ao ConfirmSignUp como se houvesse um
    // código pendente, então qualquer tentativa de "resolver" por código aqui pode acabar dizendo
    // que o espaço foi salvo quando não foi. Os apps já tratam conta não confirmada no login (pedem
    // o código e confirmam), então a orientação é uma só: entrar pelo app.
    const handleSignUpError = (error) => {
        const { kind, message } = mapAuthError(error)
        if (kind === 'exists') { setApiError(''); setStep('exists'); return }
        setApiError(message)
    }

    const handleConfirm = async (event) => {
        event.preventDefault()
        if (!/^\d{6}$/.test(code)) { setApiError('Digite os 6 dígitos do código.'); return }
        setLoading(true)
        setApiError('')
        try {
            await confirmSignUp({ clientId: COGNITO_WEB_CLIENT_ID, email, code }, clientOptions)
            trackPixel('CompleteRegistration', { content_name: 'cadastro-host' })
            setConfirmedHere(true)
            setStep('done')
        } catch (error) {
            const { kind, message } = mapAuthError(error)
            if (kind === 'alreadyConfirmed') { setConfirmedHere(true); setStep('done') } else setApiError(message)
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setApiError('')
        try {
            await resendConfirmationCode({ clientId: COGNITO_WEB_CLIENT_ID, email }, clientOptions)
            setNotice(`Reenviamos o código para ${email}.`)
            setCooldown(RESEND_COOLDOWN_SECONDS)
        } catch (error) {
            setApiError(mapAuthError(error).message)
        }
    }

    const stepIndex = { space: 0, account: 1, code: 2 }[step]
    const spaceName = form.name || 'seu espaço'

    const progress = (
        <ol className="hs-progress" aria-label="Etapas do cadastro">
            {STEPS.map((label, index) => (
                <li key={label} className={index < stepIndex ? 'is-complete' : undefined}
                    aria-current={index === stepIndex ? 'step' : undefined}>
                    <span className="hs-progress__n">{index + 1}</span>{label}
                </li>
            ))}
        </ol>
    )

    return (
        <div className="hs-page">
            <Helmet><meta name="robots" content="noindex" /></Helmet>
            <div className="container">
                {step === 'exists' && (
                    <>
                        <StepHeader title="Esse e-mail já tem cadastro." sub="Para não misturar contas, o cadastro pelo site só cria e-mails novos." />
                        <section className="hs-card hs-card--narrow">
                            <h2 className="hs-card__title">Entre no app com {email}</h2>
                            <p className="hs-text">Use a senha que você criou. Se você começou o cadastro aqui e não chegou a confirmar o e-mail, o app pede o código na hora e, depois de confirmar, o espaço que você preencheu aparece em Meus espaços.</p>
                            <p className="hs-text">Se o e-mail já estava confirmado, o espaço que você acabou de preencher não foi salvo: cadastre por lá, é rápido.</p>
                            <StoreBadges className="hs-stores" idPrefix="hs-exists" />
                            <div className="hs-actions hs-actions--start">
                                <button type="button" className="hs-link-button" onClick={() => { setApiError(''); setStep('account') }}>Usar outro e-mail</button>
                            </div>
                        </section>
                    </>
                )}

                {step === 'done' && (
                    <section className="hs-card hs-card--narrow hs-done">
                        <div className="hs-done__icon" aria-hidden="true">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5" /></svg>
                        </div>
                        <h1 className="hs-title hs-title--left">{confirmedHere ? 'Espaço salvo.' : 'Cadastro recebido.'}</h1>
                        <p className="hs-sub hs-sub--left">
                            {confirmedHere
                                ? `O ${spaceName} já está salvo na sua conta. Agora é no app:`
                                : 'Falta confirmar o e-mail. Agora é no app:'}
                        </p>
                        <ol className="hs-next">
                            <li><span className="hs-next__n">1</span>Baixe o app Hubros</li>
                            {confirmedHere ? (
                                <>
                                    <li><span className="hs-next__n">2</span>Entre com o e-mail e a senha que você acabou de criar</li>
                                    <li><span className="hs-next__n">3</span>Em Meus espaços, adicione fotos, preço e horários</li>
                                </>
                            ) : (
                                <>
                                    <li><span className="hs-next__n">2</span>Entre com {email} e a senha que você criou</li>
                                    <li><span className="hs-next__n">3</span>Digite o código que enviamos: o {spaceName} aparece em Meus espaços</li>
                                </>
                            )}
                        </ol>
                        <StoreBadges className="hs-stores" idPrefix="hs-done" />
                        <a href="/" className="hs-link-button hs-back">Voltar ao site</a>
                    </section>
                )}

                {step === 'space' && (
                    <>
                        <StepHeader title="Comece a receber reservas." sub="Dois minutos e o seu espaço fica salvo na Hubros. Fotos, preço e horários você completa depois, direto no app." />
                        {progress}
                        <form className="hs-card" onSubmit={goToAccount} noValidate>
                            <fieldset className="hs-group">
                                <legend>Sobre o espaço</legend>
                                <div className="hs-row hs-row--name">
                                    <Field id="name" label="Nome do espaço" error={errors.name}>
                                        <input id="name" name="name" className="hs-input" value={form.name} onChange={onChange}
                                            maxLength={FIELD_LIMITS.name} placeholder="Como seu espaço se chama" autoComplete="organization" />
                                    </Field>
                                    <Field id="categoria" label="Categoria" error={errors.categoria}>
                                        <select id="categoria" name="categoria" className="hs-input hs-select" value={form.categoria} onChange={onCategoriaChange}>
                                            <option value="">Selecione</option>
                                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </Field>
                                </div>
                                <Field id="subcategoria" label="Atividade principal"
                                    hint="Se o espaço reúne mais de uma atividade, escolha a principal. Você pode mudar depois no app."
                                    error={errors.subcategoria}>
                                    <select id="subcategoria" name="subcategoria" className="hs-input hs-select" value={form.subcategoria}
                                        onChange={onChange} disabled={!form.categoria}>
                                        <option value="">{form.categoria ? 'Selecione' : 'Escolha a categoria primeiro'}</option>
                                        {(SUBCATEGORIES[form.categoria] || []).map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </Field>
                                <fieldset className="hs-choice" aria-describedby={errors.ambiente ? 'ambiente-error' : undefined}>
                                    <legend className="hs-label">Como é o seu espaço?</legend>
                                    <div className="hs-choice__grid">
                                        {AMBIENTES.map(({ value, label, hint }) => (
                                            <label key={value} className="hs-choice__item">
                                                <input type="radio" name="ambiente" value={value} checked={form.ambiente === value} onChange={onChange} />
                                                <span className="hs-choice__label">{label}</span>
                                                <span className="hs-choice__hint">{hint}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.ambiente && <p id="ambiente-error" className="hs-field-error" role="alert">{errors.ambiente}</p>}
                                </fieldset>
                            </fieldset>

                            <fieldset className="hs-group">
                                <legend>Endereço</legend>
                                <div className="hs-row hs-row--cep">
                                    <Field id="zipCode" label="CEP" error={errors.zipCode}
                                        hint={cepStatus === 'loading' ? 'Buscando endereço…'
                                            : cepStatus === 'notfound' ? 'Não achamos esse CEP. Preencha o endereço à mão.'
                                                : 'Com o CEP, a gente preenche rua, bairro e cidade.'}>
                                        <input id="zipCode" name="zipCode" className="hs-input" value={form.zipCode} onChange={onCepChange}
                                            inputMode="numeric" placeholder="00000-000" autoComplete="postal-code" />
                                    </Field>
                                    <Field id="number" label="Número" error={errors.number}>
                                        <input id="number" name="number" className="hs-input" value={form.number} onChange={onChange}
                                            maxLength={FIELD_LIMITS.number} autoComplete="off" />
                                    </Field>
                                    <Field id="complement" label="Complemento" optional>
                                        <input id="complement" name="complement" className="hs-input" value={form.complement} onChange={onChange}
                                            maxLength={FIELD_LIMITS.complement} autoComplete="address-line2" />
                                    </Field>
                                </div>
                                <div className="hs-row hs-row--street">
                                    <Field id="street" label="Rua" error={errors.street}>
                                        <input id="street" name="street" className="hs-input" value={form.street} onChange={onChange}
                                            maxLength={FIELD_LIMITS.street} autoComplete="address-line1" />
                                    </Field>
                                    <Field id="district" label="Bairro" error={errors.district}>
                                        <input id="district" name="district" className="hs-input" value={form.district} onChange={onChange}
                                            maxLength={FIELD_LIMITS.district} />
                                    </Field>
                                </div>
                                <div className="hs-row hs-row--city">
                                    <Field id="city" label="Cidade" error={errors.city}>
                                        <input id="city" name="city" className="hs-input" value={form.city} onChange={onChange}
                                            maxLength={FIELD_LIMITS.city} autoComplete="address-level2" />
                                    </Field>
                                    <Field id="state" label="Estado" error={errors.state}>
                                        <select id="state" name="state" className="hs-input hs-select" value={form.state} onChange={onChange}>
                                            <option value="">UF</option>
                                            {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                                        </select>
                                    </Field>
                                </div>
                            </fieldset>

                            <div className="hs-actions">
                                <p className="hs-alt">Prefere falar com a gente? <a href={WAITLIST_URL}>Fale com a equipe</a></p>
                                <button type="submit" className="btn btn-primary hs-submit">Continuar para sua conta</button>
                            </div>
                        </form>
                    </>
                )}

                {step === 'account' && (
                    <>
                        <StepHeader title="Comece a receber reservas." sub="Crie a conta que você vai usar para entrar no app e gerenciar o espaço." />
                        {progress}
                        <form className="hs-card" onSubmit={handleSignUp} noValidate>
                            <fieldset className="hs-group">
                                <legend>Sua conta</legend>
                                <Field id="fullName" label="Nome completo" error={errors.fullName}>
                                    <input id="fullName" name="fullName" className="hs-input" value={form.fullName} onChange={onChange}
                                        autoComplete="name" />
                                </Field>
                                <div className="hs-row">
                                    <Field id="email" label="E-mail" error={errors.email}>
                                        <input id="email" name="email" type="email" className="hs-input" value={form.email} onChange={onChange}
                                            maxLength={FIELD_LIMITS.email} autoComplete="email" placeholder="seu@email.com" spellCheck={false} />
                                    </Field>
                                    <Field id="phone" label="WhatsApp" error={errors.phone}>
                                        <input id="phone" name="phone" type="tel" className="hs-input" value={form.phone}
                                            onChange={(e) => update('phone', maskPhone(e.target.value))} autoComplete="tel-national" placeholder="(11) 99999-9999" />
                                    </Field>
                                </div>
                                <Field id="password" label="Senha" error={errors.password}
                                    hint="Mínimo de 8 caracteres, com maiúscula, minúscula e número. Você vai usar essa senha para entrar no app.">
                                    <input id="password" name="password" type="password" className="hs-input" value={form.password} onChange={onChange}
                                        autoComplete="new-password" />
                                </Field>
                                <label className="hs-consent">
                                    <input type="checkbox" name="acceptTerms" checked={form.acceptTerms} onChange={onChange}
                                        aria-invalid={errors.acceptTerms ? true : undefined} />
                                    <span>Li e aceito os <a href="/termos/" target="_blank" rel="noopener noreferrer">Termos de Uso</a> e a <a href="/privacidade/" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>. Vamos enviar e-mails sobre o cadastro do seu espaço, e você pode cancelar quando quiser.</span>
                                </label>
                                {errors.acceptTerms && <p className="hs-field-error" role="alert">{errors.acceptTerms}</p>}
                                {TURNSTILE_SITE_KEY && <div ref={turnstileRef} className="hs-turnstile" />}
                            </fieldset>
                            {apiError && <p className="hs-form-error" role="alert">{apiError}</p>}
                            <div className="hs-actions">
                                <button type="button" className="hs-link-button" onClick={() => { setApiError(''); setStep('space') }}>Voltar</button>
                                <button type="submit" className="btn btn-primary hs-submit" disabled={loading}>
                                    {loading ? 'Criando…' : 'Criar conta e salvar meu espaço'}
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {step === 'code' && (
                    <>
                        <StepHeader title="Confirme seu e-mail." sub={notice} />
                        {progress}
                        <form className="hs-card hs-card--code" onSubmit={handleConfirm} noValidate>
                            <Field id="code" label="Código de 6 dígitos">
                                <input id="code" name="code" className="hs-input hs-code-input" value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" />
                            </Field>
                            {apiError && <p className="hs-form-error" role="alert">{apiError}</p>}
                            <div className="hs-actions hs-actions--stack">
                                <button type="submit" className="btn btn-primary hs-submit" disabled={loading}>
                                    {loading ? 'Confirmando…' : 'Confirmar e-mail'}
                                </button>
                                <button type="button" className="hs-link-button" onClick={handleResend} disabled={cooldown > 0}>
                                    {cooldown > 0 ? <>Reenviar código em <span className="hs-tabular">{cooldown}</span>s</> : 'Reenviar código'}
                                </button>
                                <button type="button" className="hs-link-button" onClick={() => setStep('done')}>
                                    Confirmo depois, pelo app
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default function HostSignup() {
    // Desligado (ou sem client configurado): a página só encaminha para a lista de espera.
    if (!HOST_SIGNUP_ENABLED || !COGNITO_WEB_CLIENT_ID) return <Navigate to={WAITLIST_URL} replace />
    return <HostSignupForm />
}
