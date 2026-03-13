import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const navLinks = [
        { label: 'Para Coworkers', href: '#features' },
        { label: 'Para Hosts', href: '#how-it-works' },
        { label: 'Espaços', href: '#spaces' },
        { label: 'Sobre', href: '#about' },
    ]

    return (
        <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <div className="container navbar__inner">

                <a href="/" className="navbar__logo" aria-label="Hubros">
                    <span className="navbar__logo-icon">⬡</span>
                    <span className="navbar__logo-text">Hubros</span>
                </a>

                <nav className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
                    {navLinks.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="navbar__link"
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="navbar__actions">
                    <a href="#download" className="btn btn-primary">
                        Baixar App
                    </a>
                    <button
                        className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                    >
                        <span /><span /><span />
                    </button>
                </div>

            </div>
        </header>
    )
}
