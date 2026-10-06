import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import '../Waitlist/Waitlist.css'
import './HostSignup.css'
import {
    COGNITO_REGION, COGNITO_WEB_CLIENT_ID, HOST_SIGNUP_ENABLED, TURNSTILE_SITE_KEY,
} from '../../config/hostSignup'
import { confirmSignUp, resendConfirmationCode, signUp } from '../../lib/cognito'
import {
    AMBIENTES, CATEGORIES, FIELD_LIMITS, UFS, buildSignUpRequest, lookupCep, mapAuthError, maskCep, maskPhone,
    normalizeEmail, validateAccountStep, validateSpaceStep,
} from '../../lib/hostSignup'

const APP_STORE_URL = 'https://apps.apple.com/br/app/hubros/id6762576263'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=br.com.hubros.hubros_app'
const WAITLIST_URL = '/lista-de-espera/?role=host'
const RESEND_COOLDOWN_SECONDS = 30
const STEPS = ['Seu espaço', 'Sua conta', 'Confirmação']

const EMPTY_FORM = {
    name: '', categoria: '', ambiente: '', zipCode: '', street: '', number: '', complement: '', district: '',
    city: '', state: '', fullName: '', email: '', phone: '', password: '', acceptTerms: false,
}

function Field({ id, label, error, optional, children }) {
    return (
        <div className="wl-form__field">
            <label className="wl-form__label" htmlFor={id}>
                {label}{optional && <> <span className="wl-form__optional">(opcional)</span></>}
            </label>
            {children}
            {error && <p className="hs-field-error" role="alert">{error}</p>}
        </div>
    )
}

function StoreButtons() {
    return (
        <div className="wl-app-note__stores">
            <a href={APP_STORE_URL} className="btn btn-secondary wl-app-note__store" target="_blank" rel="noopener noreferrer">App Store</a>
            <a href={PLAY_STORE_URL} className="btn btn-secondary wl-app-note__store" target="_blank" rel="noopener noreferrer">Google Play</a>
        </div>
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

    return (
        <div className="wl-page">
            <Helmet><meta name="robots" content="noindex" /></Helmet>
            <main className="wl-main">
                {step === 'exists' ? (
                    <div className="wl-card">
                        <div className="wl-card__header">
                            <div className="section-tag">Cadastre seu espaço</div>
                            <h1 className="wl-card__title">Esse e-mail já<br /><span className="text-gradient">tem cadastro</span></h1>
                            <p className="wl-card__sub">Para não misturar contas, o cadastro pelo site só cria e-mails novos.</p>
                        </div>
                        <section className="hs-option">
                            <h2 className="hs-option__title">Entre no app com {email}</h2>
                            <p className="hs-option__text">Use a senha que você criou. Se você começou o cadastro aqui e não chegou a confirmar o e-mail, o app pede o código na hora e, depois de confirmar, o espaço que você preencheu aparece em Meus espaços.</p>
                            <p className="hs-option__text">Se o e-mail já estava confirmado, o espaço que você acabou de preencher não foi salvo: cadastre por lá, é rápido.</p>
                            <StoreButtons />
                        </section>
                        <button type="button" className="hs-link-button" onClick={() => { setApiError(''); setStep('account') }}>Usar outro e-mail</button>
                    </div>
                ) : step === 'done' ? (
                    <div className="wl-success">
                        <h1 className="wl-success__title">
                            {confirmedHere ? 'Espaço salvo!' : 'Cadastro recebido!'}
                        </h1>
                        <p className="wl-success__sub">
                            {confirmedHere && `O ${form.name || 'seu espaço'} já está salvo na sua conta. Baixe o app e entre com o e-mail e a senha que você acabou de criar: ele aparece em Meus espaços, e é só adicionar fotos, preço e horários.`}
                            {!confirmedHere && `Falta confirmar o e-mail. Baixe o app, entre com ${email} e a senha que você criou e digite o código que enviamos. Depois disso o ${form.name || 'seu espaço'} aparece em Meus espaços.`}
                        </p>
                        <StoreButtons />
                        <a href="/" className="hs-back-link">Voltar ao site</a>
                    </div>
                ) : (
                    <div className="wl-card">
                        <div className="wl-card__header">
                            <div className="section-tag">Cadastre seu espaço</div>
                            <h1 className="wl-card__title">
                                {step === 'code'
                                    ? <>Confirme seu<br /><span className="text-gradient">e-mail</span></>
                                    : <>Comece a receber<br /><span className="text-gradient">reservas</span></>}
                            </h1>
                            <p className="wl-card__sub">
                                {step === 'space' && 'Dois minutos e o seu espaço fica salvo na Hubros. Fotos, preço e horários você completa depois, direto no app.'}
                                {step === 'account' && 'Crie a conta que você vai usar para entrar no app e gerenciar o espaço.'}
                                {step === 'code' && notice}
                            </p>
                        </div>

                        <ol className="hs-steps" aria-label="Etapas do cadastro">
                            {STEPS.map((label, index) => (
                                <li key={label} className={index === stepIndex ? 'hs-steps__item hs-steps__item--active' : index < stepIndex ? 'hs-steps__item hs-steps__item--done' : 'hs-steps__item'}
                                    aria-current={index === stepIndex ? 'step' : undefined}>
                                    <span className="hs-steps__dot">{index + 1}</span>{label}
                                </li>
                            ))}
                        </ol>

                        {step === 'space' && (
                            <form className="wl-form" onSubmit={goToAccount} noValidate>
                                <Field id="name" label="Nome do espaço" error={errors.name}>
                                    <input id="name" name="name" className="wl-form__input" value={form.name} onChange={onChange}
                                        maxLength={FIELD_LIMITS.name} placeholder="Como seu espaço se chama" autoComplete="organization" />
                                </Field>
                                <Field id="categoria" label="Categoria" error={errors.categoria}>
                                    <select id="categoria" name="categoria" className="wl-form__input wl-form__select" value={form.categoria} onChange={onChange}>
                                        <option value="">Selecione</option>
                                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </Field>
                                <fieldset className="hs-choice">
                                    <legend className="wl-form__label">Como é o seu espaço?</legend>
                                    {AMBIENTES.map(({ value, label, hint }) => (
                                        <label key={value} className={form.ambiente === value ? 'hs-choice__item hs-choice__item--active' : 'hs-choice__item'}>
                                            <input type="radio" name="ambiente" value={value} checked={form.ambiente === value} onChange={onChange} />
                                            <span className="hs-choice__label">{label}</span>
                                            <span className="hs-choice__hint">{hint}</span>
                                        </label>
                                    ))}
                                    {errors.ambiente && <p className="hs-field-error" role="alert">{errors.ambiente}</p>}
                                </fieldset>
                                <div className="wl-form__row">
                                    <Field id="zipCode" label="CEP" error={errors.zipCode}>
                                        <input id="zipCode" name="zipCode" className="wl-form__input" value={form.zipCode} onChange={onCepChange}
                                            inputMode="numeric" placeholder="00000-000" autoComplete="postal-code" />
                                        {cepStatus === 'loading' && <p className="hs-hint">Buscando endereço...</p>}
                                        {cepStatus === 'notfound' && <p className="hs-hint">Não achamos esse CEP. Preencha o endereço à mão.</p>}
                                    </Field>
                                    <Field id="number" label="Número" error={errors.number}>
                                        <input id="number" name="number" className="wl-form__input" value={form.number} onChange={onChange}
                                            maxLength={FIELD_LIMITS.number} autoComplete="off" />
                                    </Field>
                                </div>
                                <Field id="street" label="Rua" error={errors.street}>
                                    <input id="street" name="street" className="wl-form__input" value={form.street} onChange={onChange}
                                        maxLength={FIELD_LIMITS.street} autoComplete="address-line1" />
                                </Field>
                                <div className="wl-form__row">
                                    <Field id="complement" label="Complemento" optional>
                                        <input id="complement" name="complement" className="wl-form__input" value={form.complement} onChange={onChange}
                                            maxLength={FIELD_LIMITS.complement} autoComplete="address-line2" />
                                    </Field>
                                    <Field id="district" label="Bairro" error={errors.district}>
                                        <input id="district" name="district" className="wl-form__input" value={form.district} onChange={onChange}
                                            maxLength={FIELD_LIMITS.district} />
                                    </Field>
                                </div>
                                <div className="wl-form__row">
                                    <Field id="city" label="Cidade" error={errors.city}>
                                        <input id="city" name="city" className="wl-form__input" value={form.city} onChange={onChange}
                                            maxLength={FIELD_LIMITS.city} autoComplete="address-level2" />
                                    </Field>
                                    <Field id="state" label="Estado" error={errors.state}>
                                        <select id="state" name="state" className="wl-form__input wl-form__select" value={form.state} onChange={onChange}>
                                            <option value="">UF</option>
                                            {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                                        </select>
                                    </Field>
                                </div>
                                <button type="submit" className="btn btn-primary wl-form__submit">Continuar</button>
                                <p className="hs-alt">Prefere falar com a gente? <a href={WAITLIST_URL}>Fale com a equipe</a></p>
                            </form>
                        )}

                        {step === 'account' && (
                            <form className="wl-form" onSubmit={handleSignUp} noValidate>
                                <Field id="fullName" label="Nome completo" error={errors.fullName}>
                                    <input id="fullName" name="fullName" className="wl-form__input" value={form.fullName} onChange={onChange}
                                        autoComplete="name" />
                                </Field>
                                <Field id="email" label="E-mail" error={errors.email}>
                                    <input id="email" name="email" type="email" className="wl-form__input" value={form.email} onChange={onChange}
                                        maxLength={FIELD_LIMITS.email} autoComplete="email" placeholder="seu@email.com" />
                                </Field>
                                <Field id="phone" label="WhatsApp" error={errors.phone}>
                                    <input id="phone" name="phone" type="tel" className="wl-form__input" value={form.phone}
                                        onChange={(e) => update('phone', maskPhone(e.target.value))} autoComplete="tel-national" placeholder="(11) 99999-9999" />
                                </Field>
                                <Field id="password" label="Senha" error={errors.password}>
                                    <input id="password" name="password" type="password" className="wl-form__input" value={form.password} onChange={onChange}
                                        autoComplete="new-password" />
                                    <p className="hs-hint">Mínimo de 8 caracteres, com maiúscula, minúscula e número. Você vai usar essa senha para entrar no app.</p>
                                </Field>
                                <label className="wl-form__consent">
                                    <input type="checkbox" name="acceptTerms" checked={form.acceptTerms} onChange={onChange} className="wl-form__consent-check" />
                                    <span>Li e aceito os <a href="/termos/" target="_blank" rel="noopener noreferrer">Termos de Uso</a> e a <a href="/privacidade/" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>. Vamos enviar e-mails sobre o cadastro do seu espaço, e você pode cancelar quando quiser.</span>
                                </label>
                                {errors.acceptTerms && <p className="hs-field-error" role="alert">{errors.acceptTerms}</p>}
                                {TURNSTILE_SITE_KEY && <div ref={turnstileRef} className="hs-turnstile" />}
                                {apiError && <p className="wl-form__error" role="alert">{apiError}</p>}
                                <button type="submit" className="btn btn-primary wl-form__submit" disabled={loading}>
                                    {loading ? 'Criando...' : 'Criar conta e salvar meu espaço'}
                                </button>
                                <button type="button" className="hs-link-button" onClick={() => { setApiError(''); setStep('space') }}>Voltar</button>
                            </form>
                        )}

                        {step === 'code' && (
                            <form className="wl-form" onSubmit={handleConfirm} noValidate>
                                <Field id="code" label="Código de 6 dígitos">
                                    <input id="code" name="code" className="wl-form__input hs-code-input" value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" />
                                </Field>
                                {apiError && <p className="wl-form__error" role="alert">{apiError}</p>}
                                <button type="submit" className="btn btn-primary wl-form__submit" disabled={loading}>
                                    {loading ? 'Confirmando...' : 'Confirmar e-mail'}
                                </button>
                                <button type="button" className="hs-link-button" onClick={handleResend} disabled={cooldown > 0}>
                                    {cooldown > 0 ? `Reenviar código em ${cooldown}s` : 'Reenviar código'}
                                </button>
                                <button type="button" className="hs-link-button" onClick={() => setStep('done')}>
                                    Confirmo depois, pelo app
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

export default function HostSignup() {
    // Desligado (ou sem client configurado): a página só encaminha para a lista de espera.
    if (!HOST_SIGNUP_ENABLED || !COGNITO_WEB_CLIENT_ID) return <Navigate to={WAITLIST_URL} replace />
    return <HostSignupForm />
}
