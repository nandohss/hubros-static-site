import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './CookieConsent.css'

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)
    const [hasConsented, setHasConsented] = useState(true) // assume true until we check

    useEffect(() => {
        const consent = localStorage.getItem('hubros_cookie_consent')
        if (!consent) {
            setHasConsented(false)
            // Timeout to allow smooth slide-in after render
            setTimeout(() => setIsVisible(true), 500)
        }
    }, [])

    const handleAcceptAll = () => {
        localStorage.setItem('hubros_cookie_consent', 'all')
        setIsVisible(false)
        setTimeout(() => setHasConsented(true), 600) // wait for animation
    }

    const handleAcceptEssential = () => {
        localStorage.setItem('hubros_cookie_consent', 'essential')
        setIsVisible(false)
        setTimeout(() => setHasConsented(true), 600)
    }

    if (hasConsented) return null

    return (
        <div className={`cookie-consent ${isVisible ? 'visible' : ''}`}>
            <div className="cookie-consent__header">
                <span className="cookie-consent__icon">🍪</span>
                <span className="cookie-consent__title">Sua privacidade importa!</span>
            </div>
            
            <p className="cookie-consent__text">
                Utilizamos cookies essenciais para o funcionamento da plataforma e cookies analíticos para melhorar a sua experiência como Coworker ou Cohoster. Ao usar nosso site, você concorda com nossa <Link to="/cookies">Política de Cookies</Link>.
            </p>

            <div className="cookie-consent__actions">
                <button 
                    className="cookie-consent__btn cookie-consent__btn--secondary" 
                    onClick={handleAcceptEssential}
                >
                    Apenas Essenciais
                </button>
                <button 
                    className="cookie-consent__btn cookie-consent__btn--primary" 
                    onClick={handleAcceptAll}
                >
                    Aceitar Todos
                </button>
            </div>
        </div>
    )
}
