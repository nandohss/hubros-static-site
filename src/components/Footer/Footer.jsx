import './Footer.css'

const footerLinks = {
    'Produto': ['Para Coworkers', 'Para Hosts', 'Como Funciona', 'Preços', 'Vouchers'],
    'Empresa': ['Sobre Nós', 'Blog', 'Carreiras', 'Imprensa', 'Contato'],
    'Suporte': ['Central de Ajuda', 'Guia do Coworker', 'Guia do Host', 'Fale Conosco'],
    'Legal': ['Termos de Uso', 'Privacidade', 'Cookies'],
}

export default function Footer() {
    const year = new Date().getFullYear()
    return (
        <footer className="footer" id="about">
            <div className="footer__top-border" aria-hidden="true" />
            <div className="container">
                <div className="footer__inner">
                    <div className="footer__brand">
                        <a href="/" className="footer__logo">
                            <span className="footer__logo-icon">⬡</span>
                            <span className="footer__logo-text">Hubros</span>
                        </a>
                        <p className="footer__tagline">
                            A plataforma que conecta profissionais a espaços incríveis de coworking por todo o Brasil.
                        </p>
                        <div className="footer__social">
                            {['𝕏', 'in', '▶', '📸'].map((icon, i) => (
                                <a key={i} href="#" className="footer__social-btn" aria-label={`Red social ${i}`}>
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([group, links]) => (
                        <div key={group} className="footer__col">
                            <h4 className="footer__col-title">{group}</h4>
                            <ul className="footer__col-links">
                                {links.map(link => (
                                    <li key={link}>
                                        <a href="#" className="footer__link">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="footer__bottom">
                    <p className="footer__copy">
                        © {year} Hubros. Todos os direitos reservados.
                    </p>
                    <p className="footer__made">
                        Feito com ❤️ no Brasil 🇧🇷
                    </p>
                </div>
            </div>
        </footer>
    )
}
