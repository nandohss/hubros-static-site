// Logo do HuBros — usa o PNG oficial do app
import logoSrc from '../../assets/logo.png'

export default function HubrosLogo({ size = 32, className = '' }) {
    return (
        <img
            src={logoSrc}
            width={size}
            height={size}
            alt="Hubros logo"
            className={className}
            style={{ display: 'block', objectFit: 'contain', borderRadius: '22%' }}
        />
    )
}