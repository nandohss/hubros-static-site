// Cadastro de espaço direto no site (/cadastrar-espaco/).
//
// Ligado em 06/10/2026, depois de os dois triggers do Cognito (PreSignUp e PostConfirmation)
// entrarem no user pool: sem eles a conta é criada mas o espaço rascunho não. Se for preciso
// desligar, a rota volta a redirecionar para a lista de espera (e os triggers do pool podem
// ser removidos com infra-identity-security/attach-cognito-triggers.py --detach --apply).
export const HOST_SIGNUP_ENABLED = true

export const COGNITO_REGION = 'sa-east-1'

// App client exclusivo do site (hubros-web-signup), sem nenhum fluxo de login.
// O ID é público por natureza (os apps também o carregam). Vazio = cadastro indisponível.
export const COGNITO_WEB_CLIENT_ID = '4kllelcbjsej1e3ie3jpt7ldir'

// Chave pública do Cloudflare Turnstile. Vazia = o formulário não mostra o desafio.
export const TURNSTILE_SITE_KEY = '0x4AAAAAAFOzqMV6I9gDU6lY'
