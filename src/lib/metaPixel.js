// Ponte do app React para o Pixel da Meta carregado por /meta-pixel.js.
// Se o pixel não carregou (sem ID, cookies só essenciais, prerender), não faz nada.
export function trackPixel(event, params) {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
    window.fbq('track', event, params)
}

// Para quando a pessoa escolhe "Apenas Essenciais" com o pixel já carregado na sessão.
export function revokePixelConsent() {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
    window.fbq('consent', 'revoke')
}
