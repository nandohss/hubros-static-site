/*
 * Pixel da Meta (Facebook/Instagram Ads).
 *
 * Carregado como script clássico, sem bundler, por dois caminhos:
 *   - index.html do app React (todas as rotas, inclusive /cadastrar-espaco)
 *   - <head> externo da landing /espacos/ (fora do template do bundler)
 *
 * Na landing, o bundler troca o <html> inteiro com replaceWith, mas o `window`
 * e o `document` continuam os mesmos: o fbq e o listener de clique registrado
 * aqui sobrevivem à troca.
 *
 * Eventos:
 *   PageView              toda página (o app manda de novo a cada troca de rota)
 *   CliqueCadastro        clique em link para /cadastrar-espaco (evento próprio)
 *   Contact               clique em link de WhatsApp (wa.me)
 *   Lead                  conta criada no formulário de host (HostSignup.jsx)
 *   CompleteRegistration  código de e-mail confirmado (HostSignup.jsx)
 *
 * Não carrega quando:
 *   - PIXEL_ID está vazio;
 *   - a pessoa escolheu "Apenas Essenciais" no aviso de cookies;
 *   - o navegador é automatizado (o prerender do build roda no Puppeteer e
 *     dispararia PageView falso a cada deploy).
 */
(function () {
    var PIXEL_ID = '1627570679014411';

    if (!PIXEL_ID) return;
    if (navigator.webdriver) return;
    try {
        if (localStorage.getItem('hubros_cookie_consent') === 'essential') return;
    } catch (e) { /* localStorage bloqueado: segue sem a checagem */ }

    /* Snippet oficial da Meta */
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ?
                n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');

    /* Cliques: um listener só, na fase de captura, no document. */
    document.addEventListener('click', function (event) {
        var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
        if (!link) return;
        var href = link.getAttribute('href') || '';
        if (href.indexOf('/cadastrar-espaco') !== -1) {
            window.fbq('trackCustom', 'CliqueCadastro', { origem: location.pathname });
        } else if (href.indexOf('wa.me/') !== -1) {
            window.fbq('track', 'Contact', { origem: location.pathname });
        }
    }, true);
})();
