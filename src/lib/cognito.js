// Chamadas públicas do Cognito (SignUp, ConfirmSignUp, ResendConfirmationCode).
// São as mesmas que o Amplify faz no navegador: não exigem login nem credencial,
// só o ClientId, então não há biblioteca nem token guardado no navegador.

export class CognitoError extends Error {
    constructor(code, message) {
        super(message || code)
        this.name = 'CognitoError'
        this.code = code
    }
}

async function call(target, body, { region, fetchImpl = fetch }) {
    const response = await fetchImpl(`https://cognito-idp.${region}.amazonaws.com/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-amz-json-1.1',
            'X-Amz-Target': `AWSCognitoIdentityProviderService.${target}`,
        },
        body: JSON.stringify(body),
    })
    let data = {}
    try {
        data = await response.json()
    } catch {
        // corpo vazio ou não JSON: cai no erro genérico abaixo
    }
    if (!response.ok) {
        // __type pode vir como "com.amazonaws...#CodeMismatchException"
        const code = String(data.__type || data.code || 'UnknownError').split('#').pop()
        throw new CognitoError(code, data.message || data.Message)
    }
    return data
}

export const signUp = (request, options) => call('SignUp', request, options)

export const confirmSignUp = ({ clientId, email, code }, options) =>
    call('ConfirmSignUp', { ClientId: clientId, Username: email, ConfirmationCode: code }, options)

export const resendConfirmationCode = ({ clientId, email }, options) =>
    call('ResendConfirmationCode', { ClientId: clientId, Username: email }, options)
