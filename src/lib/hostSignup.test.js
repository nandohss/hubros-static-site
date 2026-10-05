import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

import {
    CATEGORIES, MAX_METADATA_BYTES, SITE_SOURCE, UFS, buildSignUpRequest, buildSpace, isValidEmail,
    isValidPhone, lookupCep, mapAuthError, maskCep, maskPhone, onlyDigits, passwordError,
    validateAccountStep, validateSpaceStep,
} from './hostSignup.js'
import { CognitoError } from './cognito.js'

const spaceForm = {
    name: ' Meu Coworking ', categoria: CATEGORIES[0], zipCode: '01310-100', street: 'Av. Paulista',
    number: '1000', complement: '', district: 'Bela Vista', city: 'São Paulo', state: 'sp',
}
const accountForm = {
    fullName: 'Ana Souza', email: ' Ana@Example.COM ', phone: '(11) 98765-4321',
    password: 'Senha1234', acceptTerms: true,
}
const form = { ...spaceForm, ...accountForm }

test('as categorias são idênticas às dos apps (inclusive o hífen U+2011)', () => {
    assert.deepEqual(CATEGORIES, ['Escritório e Negócios', 'Saúde e Bem‑estar', 'Eventos e Sociais'])
    assert.ok(CATEGORIES[1].includes('‑'))
    const swift = new URL('../../../coworking_product/coworking_product/Domain/Shared/Models/SpaceCategory.swift', import.meta.url)
    if (!existsSync(swift)) return // fora da máquina de desenvolvimento: sem o repo do app ao lado
    const source = readFileSync(swift, 'utf8')
    for (const categoria of CATEGORIES) {
        assert.ok(source.includes(`"${categoria}"`), `${categoria} não existe no SpaceCategory.swift`)
    }
})

test('máscaras', () => {
    assert.equal(maskCep('01310100'), '01310-100')
    assert.equal(maskCep('0131'), '0131')
    assert.equal(maskCep('01310-100999'), '01310-100')
    assert.equal(maskPhone('11987654321'), '(11) 98765-4321')
    assert.equal(maskPhone('1187654321'), '(11) 8765-4321')
    assert.equal(maskPhone('1'), '(1')
    assert.equal(maskPhone(''), '')
    assert.equal(onlyDigits('(11) 98765-4321'), '11987654321')
})

test('validação de e-mail, telefone e senha', () => {
    assert.ok(isValidEmail(' a@b.co '))
    for (const ruim of ['', 'sem-arroba', 'a@b', 'a b@c.com', 'a@' + 'x'.repeat(130) + '.com']) assert.ok(!isValidEmail(ruim), ruim)
    assert.ok(isValidPhone('(11) 98765-4321'))
    assert.ok(isValidPhone('1187654321'))
    for (const ruim of ['', '119876543', '(11) 88765-4321', '(01) 98765-4321', '119876543211']) assert.ok(!isValidPhone(ruim), ruim)
    assert.equal(passwordError('Senha1234'), null)
    assert.ok(passwordError('curta1A'))
    assert.ok(passwordError('SEMMINUSCULA1'))
    assert.ok(passwordError('semmaiuscula1'))
    assert.ok(passwordError('SemNumeroAqui'))
})

test('validação dos passos devolve um erro por campo inválido', () => {
    assert.deepEqual(validateSpaceStep(spaceForm), {})
    assert.deepEqual(Object.keys(validateSpaceStep({})).sort(),
        ['categoria', 'city', 'district', 'name', 'number', 'state', 'street', 'zipCode'])
    assert.ok(validateSpaceStep({ ...spaceForm, categoria: 'Beleza e Estética' }).categoria) // inativa nos apps
    assert.ok(validateSpaceStep({ ...spaceForm, zipCode: '123' }).zipCode)
    assert.ok(validateSpaceStep({ ...spaceForm, state: 'XX' }).state)
    assert.deepEqual(validateAccountStep(accountForm), {})
    assert.deepEqual(Object.keys(validateAccountStep({})).sort(),
        ['acceptTerms', 'email', 'fullName', 'password', 'phone'])
    assert.ok(validateAccountStep({ ...accountForm, acceptTerms: false }).acceptTerms)
    assert.ok(UFS.includes('SP') && UFS.length === 27)
})

test('buildSpace: só strings, só os campos do backend, telefone no formato do app', () => {
    const space = buildSpace(form)
    assert.deepEqual(space, {
        name: 'Meu Coworking', categoria: 'Escritório e Negócios', zipCode: '01310100',
        street: 'Av. Paulista', number: '1000', district: 'Bela Vista', city: 'São Paulo', state: 'SP',
        email: 'ana@example.com', ddd: '11', numeroTelefone: '987654321', telefoneCompleto: '11987654321',
    })
    assert.ok(!('complement' in space)) // vazio sai do payload
    assert.ok(Object.values(space).every((v) => typeof v === 'string'))
    // nada de dono, preço, disponibilidade ou rascunho vindo do navegador
    for (const proibido of ['hoster', 'isDraft', 'availability', 'precoHora', 'spaceId', 'password']) {
        assert.ok(!(proibido in space), proibido)
    }
})

test('buildSignUpRequest monta o SignUp com a marca do site', () => {
    const req = buildSignUpRequest({ clientId: 'cid', form })
    assert.equal(req.ClientId, 'cid')
    assert.equal(req.Username, 'ana@example.com')
    assert.equal(req.Password, 'Senha1234')
    assert.deepEqual(req.UserAttributes, [
        { Name: 'email', Value: 'ana@example.com' }, { Name: 'name', Value: 'Ana Souza' }])
    assert.equal(req.ClientMetadata.source, SITE_SOURCE)
    assert.equal(typeof req.ClientMetadata.space, 'string') // Cognito só aceita string no metadata
    assert.equal(JSON.parse(req.ClientMetadata.space).name, 'Meu Coworking')
    assert.ok(new TextEncoder().encode(req.ClientMetadata.space).length <= MAX_METADATA_BYTES)
    assert.ok(!('ValidationData' in req))
    const comDesafio = buildSignUpRequest({ clientId: 'cid', form, turnstileToken: 'tok' })
    assert.deepEqual(comDesafio.ValidationData, [{ Name: 'turnstileToken', Value: 'tok' }])
})

test('o pior caso de tamanho cabe nos 2 KB que o PreSignUp aceita', () => {
    const maximo = {
        ...form, name: 'n'.repeat(80), street: 'r'.repeat(120), number: '9'.repeat(10),
        complement: 'c'.repeat(60), district: 'b'.repeat(80), city: 'x'.repeat(80),
        email: `${'e'.repeat(100)}@exemplo.com`,
    }
    assert.doesNotThrow(() => buildSignUpRequest({ clientId: 'cid', form: maximo }))
    // acentos ocupam 2 bytes em UTF-8: o limite é em bytes, não em caracteres
    const acentuado = { ...maximo, name: 'é'.repeat(80), street: 'ã'.repeat(120), district: 'ç'.repeat(80), city: 'ó'.repeat(80), complement: 'ê'.repeat(60) }
    assert.doesNotThrow(() => buildSignUpRequest({ clientId: 'cid', form: acentuado }))
})

test('mapAuthError traduz os erros do Cognito', () => {
    const e = (code, message = '') => new CognitoError(code, message)
    assert.equal(mapAuthError(e('UsernameExistsException')).kind, 'exists')
    assert.equal(mapAuthError(e('InvalidPasswordException')).kind, 'password')
    assert.equal(mapAuthError(e('CodeMismatchException')).kind, 'code')
    assert.equal(mapAuthError(e('ExpiredCodeException')).kind, 'code')
    assert.equal(mapAuthError(e('LimitExceededException')).kind, 'throttle')
    assert.equal(mapAuthError(e('TooManyRequestsException')).kind, 'throttle')
    assert.equal(mapAuthError(e('UserLambdaValidationException')).kind, 'captcha')
    assert.equal(mapAuthError(e('InvalidParameterException', 'User is already confirmed.')).kind, 'alreadyConfirmed')
    assert.equal(mapAuthError(e('NotAuthorizedException', 'User cannot be confirmed. Current status is CONFIRMED')).kind, 'alreadyConfirmed')
    assert.equal(mapAuthError(e('InvalidParameterException', 'outra coisa')).kind, 'generic')
    assert.equal(mapAuthError(e('Qualquer')).kind, 'generic')
    assert.equal(mapAuthError(new TypeError('Failed to fetch')).kind, 'network')
    assert.equal(mapAuthError(undefined).kind, 'network')
})

test('lookupCep', async () => {
    const calls = []
    const ok = async (url) => { calls.push(url); return { ok: true, json: async () => ({ logradouro: 'Avenida Paulista', bairro: 'Bela Vista', localidade: 'São Paulo', uf: 'SP' }) } }
    assert.deepEqual(await lookupCep('01310-100', ok), { street: 'Avenida Paulista', district: 'Bela Vista', city: 'São Paulo', state: 'SP' })
    assert.deepEqual(calls, ['https://viacep.com.br/ws/01310100/json/'])

    assert.equal(await lookupCep('123', async () => { throw new Error('não deveria chamar') }), null)
    assert.equal(await lookupCep('99999999', async () => ({ ok: true, json: async () => ({ erro: true }) })), null)
    assert.equal(await lookupCep('01310100', async () => ({ ok: false })), null)
    assert.equal(await lookupCep('01310100', async () => { throw new TypeError('offline') }), null)
})
