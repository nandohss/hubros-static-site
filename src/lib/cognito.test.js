import { test } from 'node:test'
import assert from 'node:assert/strict'

import { CognitoError, confirmSignUp, resendConfirmationCode, signUp } from './cognito.js'

const options = (fetchImpl) => ({ region: 'sa-east-1', fetchImpl })

function fakeFetch(status, payload, seen = []) {
    return async (url, init) => {
        seen.push({ url, init })
        return { ok: status >= 200 && status < 300, status, json: async () => payload }
    }
}

test('signUp envia o alvo, os cabeçalhos e o corpo certos', async () => {
    const seen = []
    const result = await signUp({ ClientId: 'cid', Username: 'a@b.co' }, options(fakeFetch(200, { UserSub: 'sub-1' }, seen)))
    assert.equal(result.UserSub, 'sub-1')
    const [{ url, init }] = seen
    assert.equal(url, 'https://cognito-idp.sa-east-1.amazonaws.com/')
    assert.equal(init.method, 'POST')
    assert.equal(init.headers['X-Amz-Target'], 'AWSCognitoIdentityProviderService.SignUp')
    assert.equal(init.headers['Content-Type'], 'application/x-amz-json-1.1')
    assert.deepEqual(JSON.parse(init.body), { ClientId: 'cid', Username: 'a@b.co' })
    assert.ok(!('Authorization' in init.headers)) // chamada pública: nenhuma credencial
})

test('confirmSignUp e resendConfirmationCode usam os campos do Cognito', async () => {
    const seen = []
    await confirmSignUp({ clientId: 'cid', email: 'a@b.co', code: '123456' }, options(fakeFetch(200, {}, seen)))
    assert.equal(seen[0].init.headers['X-Amz-Target'], 'AWSCognitoIdentityProviderService.ConfirmSignUp')
    assert.deepEqual(JSON.parse(seen[0].init.body), { ClientId: 'cid', Username: 'a@b.co', ConfirmationCode: '123456' })
    await resendConfirmationCode({ clientId: 'cid', email: 'a@b.co' }, options(fakeFetch(200, {}, seen)))
    assert.equal(seen[1].init.headers['X-Amz-Target'], 'AWSCognitoIdentityProviderService.ResendConfirmationCode')
    assert.deepEqual(JSON.parse(seen[1].init.body), { ClientId: 'cid', Username: 'a@b.co' })
})

test('erro do Cognito vira CognitoError com o código sem o prefixo', async () => {
    const f = fakeFetch(400, { __type: 'com.amazonaws.cognito#CodeMismatchException', message: 'Invalid code' })
    await assert.rejects(confirmSignUp({ clientId: 'c', email: 'a@b.co', code: '1' }, options(f)), (err) => {
        assert.ok(err instanceof CognitoError)
        assert.equal(err.code, 'CodeMismatchException')
        assert.equal(err.message, 'Invalid code')
        return true
    })
    const semTipo = async () => ({ ok: false, json: async () => { throw new Error('não é json') } })
    await assert.rejects(signUp({}, options(semTipo)), (err) => err.code === 'UnknownError')
})

test('falha de rede propaga (a interface a traduz como "sem conexão")', async () => {
    const offline = async () => { throw new TypeError('Failed to fetch') }
    await assert.rejects(signUp({}, options(offline)), TypeError)
})
