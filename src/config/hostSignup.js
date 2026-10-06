// Cadastro de espaço direto no site (/cadastrar-espaco/).
//
// DESLIGADO por padrão. Só ligar quando os dois triggers do Cognito (PreSignUp e
// PostConfirmation) estiverem no user pool: sem eles a conta é criada mas o espaço
// rascunho não. Enquanto estiver desligado, a rota redireciona para a lista de espera.
export const HOST_SIGNUP_ENABLED = false

export const COGNITO_REGION = 'sa-east-1'

// App client exclusivo do site (hubros-web-signup), sem nenhum fluxo de login.
// O ID é público por natureza (os apps também o carregam). Vazio = cadastro indisponível.
export const COGNITO_WEB_CLIENT_ID = '4kllelcbjsej1e3ie3jpt7ldir'

// Chave pública do Cloudflare Turnstile. Vazia = o formulário não mostra o desafio.
export const TURNSTILE_SITE_KEY = '0x4AAAAAAFOzqMV6I9gDU6lY'
