// Regras do cadastro de espaço feito no site: máscaras, validação, montagem do
// payload que vira o rascunho e tradução dos erros do Cognito. Funções puras, para
// poderem ser testadas sem navegador (node --test src/lib).

export const SITE_SOURCE = 'site-cadastro-espaco'

// Categorias ativas nos apps (SpaceCategory.swift e space_category.dart). O valor
// tem que ser IDÊNTICO ao dos apps, inclusive o hífen não separável (U+2011) de
// "Bem‑estar": é por essa string que o app reconhece a categoria do espaço.
export const CATEGORIES = [
    'Escritório e Negócios',
    'Saúde e Bem‑estar',
    'Eventos e Sociais',
]

// Como o host descreve o espaço. Define como o rascunho nasce: "unico" já vem com o recurso de
// ambiente único (é assim que os apps reconhecem um ambiente único: exatamente 1 recurso
// fullSpace) e "multiplos" nasce sem recursos, para cadastrar cada um no app.
export const AMBIENTES = [
    { value: 'unico', label: 'Um único ambiente', hint: 'Ex.: consultório, salão, sala única. Você define preço e capacidade no app.' },
    { value: 'multiplos', label: 'Múltiplos ambientes', hint: 'Ex.: coworking com várias salas ou mesas, clínica com vários consultórios. Você cadastra cada ambiente no app.' },
]

// Mesmos limites do create_draft_space (lambda-spaces-controller). O PreSignUp
// descarta o espaço inteiro se o metadata passar de 2 KB.
export const FIELD_LIMITS = {
    name: 80, street: 120, number: 10, complement: 60, district: 80, city: 80,
    state: 2, email: 120,
}
export const MAX_METADATA_BYTES = 2048

export const UFS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

export const onlyDigits = (value = '') => String(value).replace(/\D/g, '')

export function maskCep(value) {
    const d = onlyDigits(value).slice(0, 8)
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export function maskPhone(value) {
    const d = onlyDigits(value).slice(0, 11)
    if (d.length <= 2) return d.length ? `(${d}` : ''
    const ddd = d.slice(0, 2)
    const rest = d.slice(2)
    const split = rest.length > 8 ? 5 : 4
    return rest.length > split ? `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}` : `(${ddd}) ${rest}`
}

export const normalizeEmail = (value = '') => String(value).trim().toLowerCase()

export const isValidEmail = (value) =>
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizeEmail(value)) && normalizeEmail(value).length <= FIELD_LIMITS.email

export function isValidPhone(value) {
    const d = onlyDigits(value)
    if (d.length !== 10 && d.length !== 11) return false
    if (Number(d.slice(0, 2)) < 11) return false
    return d.length === 10 || d[2] === '9'
}

export const isValidCep = (value) => onlyDigits(value).length === 8

// Mesma política do user pool: 8+ caracteres, maiúscula, minúscula e número.
export function passwordError(password = '') {
    if (password.length < 8) return 'Use pelo menos 8 caracteres.'
    if (!/[a-z]/.test(password)) return 'Inclua uma letra minúscula.'
    if (!/[A-Z]/.test(password)) return 'Inclua uma letra maiúscula.'
    if (!/\d/.test(password)) return 'Inclua um número.'
    return null
}

const required = (value) => String(value || '').trim().length > 0

export function validateSpaceStep(form) {
    const errors = {}
    if (!required(form.name)) errors.name = 'Informe o nome do espaço.'
    if (!CATEGORIES.includes(form.categoria)) errors.categoria = 'Escolha uma categoria.'
    if (!AMBIENTES.some((a) => a.value === form.ambiente)) errors.ambiente = 'Escolha como é o seu espaço.'
    if (!isValidCep(form.zipCode)) errors.zipCode = 'Informe um CEP com 8 dígitos.'
    if (!required(form.street)) errors.street = 'Informe a rua.'
    if (!required(form.number)) errors.number = 'Informe o número.'
    if (!required(form.district)) errors.district = 'Informe o bairro.'
    if (!required(form.city)) errors.city = 'Informe a cidade.'
    if (!UFS.includes(String(form.state || '').toUpperCase())) errors.state = 'Escolha o estado.'
    return errors
}

export function validateAccountStep(form) {
    const errors = {}
    if (!required(form.fullName)) errors.fullName = 'Informe seu nome completo.'
    if (!isValidEmail(form.email)) errors.email = 'Informe um e-mail válido.'
    if (!isValidPhone(form.phone)) errors.phone = 'Informe o WhatsApp com DDD.'
    const pwd = passwordError(form.password)
    if (pwd) errors.password = pwd
    if (!form.acceptTerms) errors.acceptTerms = 'É preciso aceitar os Termos e a Política de Privacidade.'
    return errors
}

const trimTo = (value, max) => String(value || '').trim().slice(0, max)

// Dados do espaço que viram o rascunho. Só strings, só os campos que o backend aceita.
export function buildSpace(form) {
    const phone = onlyDigits(form.phone)
    const space = {
        name: trimTo(form.name, FIELD_LIMITS.name),
        categoria: form.categoria,
        ambiente: form.ambiente,
        zipCode: onlyDigits(form.zipCode).slice(0, 8),
        street: trimTo(form.street, FIELD_LIMITS.street),
        number: trimTo(form.number, FIELD_LIMITS.number),
        complement: trimTo(form.complement, FIELD_LIMITS.complement),
        district: trimTo(form.district, FIELD_LIMITS.district),
        city: trimTo(form.city, FIELD_LIMITS.city),
        state: trimTo(form.state, FIELD_LIMITS.state).toUpperCase(),
        email: trimTo(normalizeEmail(form.email), FIELD_LIMITS.email),
        ddd: phone.slice(0, 2),
        numeroTelefone: phone.slice(2),
        // Mesmo formato do app: DDD + número, só dígitos, sem +55.
        telefoneCompleto: phone,
    }
    // Campos vazios saem do payload (o backend também os ignora).
    return Object.fromEntries(Object.entries(space).filter(([, v]) => v !== ''))
}

export function buildSignUpRequest({ clientId, form, turnstileToken }) {
    const spaceJson = JSON.stringify(buildSpace(form))
    if (new TextEncoder().encode(spaceJson).length > MAX_METADATA_BYTES) {
        throw new Error('Dados do espaço grandes demais.')
    }
    const email = normalizeEmail(form.email)
    return {
        ClientId: clientId,
        Username: email,
        Password: form.password,
        UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'name', Value: String(form.fullName).trim() },
        ],
        // O PreSignUp só guarda o espaço se vier esta marca (os apps não a mandam).
        ClientMetadata: { source: SITE_SOURCE, space: spaceJson },
        ...(turnstileToken ? { ValidationData: [{ Name: 'turnstileToken', Value: turnstileToken }] } : {}),
    }
}

// kind: 'exists' | 'alreadyConfirmed' | 'code' | 'password' | 'throttle' | 'captcha' | 'network' | 'generic'
export function mapAuthError(error) {
    if (!error || error.name !== 'CognitoError') {
        return { kind: 'network', message: 'Sem conexão. Verifique sua internet e tente de novo.' }
    }
    const text = String(error.message || '')
    switch (error.code) {
        case 'UsernameExistsException':
            return { kind: 'exists', message: 'Esse e-mail já tem cadastro na Hubros.' }
        case 'InvalidPasswordException':
            return { kind: 'password', message: 'Essa senha não atende aos requisitos. Use 8+ caracteres com maiúscula, minúscula e número.' }
        case 'CodeMismatchException':
            return { kind: 'code', message: 'Código incorreto. Confira o e-mail e tente de novo.' }
        case 'ExpiredCodeException':
            return { kind: 'code', message: 'Esse código expirou. Peça um novo.' }
        case 'LimitExceededException':
        case 'TooManyRequestsException':
        case 'TooManyFailedAttemptsException':
            return { kind: 'throttle', message: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.' }
        case 'UserLambdaValidationException':
            return { kind: 'captcha', message: 'Não foi possível validar a verificação de segurança. Recarregue a página e tente de novo.' }
        case 'NotAuthorizedException':
            if (/confirmed/i.test(text)) return { kind: 'alreadyConfirmed', message: 'Esse e-mail já foi confirmado.' }
            return { kind: 'generic', message: 'Não foi possível concluir. Tente de novo.' }
        case 'InvalidParameterException':
            if (/already confirmed/i.test(text)) return { kind: 'alreadyConfirmed', message: 'Esse e-mail já foi confirmado.' }
            return { kind: 'generic', message: 'Confira os dados e tente de novo.' }
        default:
            return { kind: 'generic', message: 'Algo deu errado. Tente de novo em instantes.' }
    }
}

// ViaCEP. Devolve null se o CEP não existe ou o serviço falhar: o formulário segue
// permitindo preencher o endereço à mão.
export async function lookupCep(cep, fetchImpl = fetch) {
    const digits = onlyDigits(cep)
    if (digits.length !== 8) return null
    try {
        const response = await fetchImpl(`https://viacep.com.br/ws/${digits}/json/`)
        if (!response.ok) return null
        const data = await response.json()
        if (data.erro) return null
        return {
            street: data.logradouro || '',
            district: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
        }
    } catch {
        return null
    }
}
