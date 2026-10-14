// Selos oficiais das lojas — os mesmos arquivos que o site já usava no CTA.
export const APP_STORE_URL = 'https://apps.apple.com/br/app/hubros/id6762576263'
export const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=br.com.hubros.hubros_app'

export default function StoreBadges({ className = '', idPrefix = 'store' }) {
    return (
        <div className={`store-badges ${className}`}>
            <a href={APP_STORE_URL} id={`${idPrefix}-appstore`}>
                <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Baixar na App Store"
                    width="156"
                    height="52"
                />
            </a>
            <a href={GOOGLE_PLAY_URL} id={`${idPrefix}-googleplay`} target="_blank" rel="noopener noreferrer">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Disponível no Google Play"
                    width="175"
                    height="52"
                />
            </a>
        </div>
    )
}
