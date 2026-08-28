import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Seo from './components/Seo'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Spaces from './components/Spaces/Spaces'
import Features from './components/Features/Features'
import HowItWorks from './components/HowItWorks/HowItWorks'
import ForHosts from './components/ForHosts/ForHosts'
// Depoimentos ocultos temporariamente na home (26/08/2026).
// import Testimonials from './components/Testimonials/Testimonials'
import Waitlist from './components/Waitlist/Waitlist'
import CTA from './components/CTA/CTA'
import HelpCenter from './components/HelpCenter/HelpCenter'
import About from './components/About/About'
import Cookies from './components/Legal/Cookies'
import Terms from './components/Legal/Terms'
import Privacy from './components/Legal/Privacy'
import CookieConsent from './components/Legal/CookieConsent'
import Footer from './components/Footer/Footer'
import BlogIndex from './components/Blog/BlogIndex'
import BlogPost from './components/Blog/BlogPost'

const ORG_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Hubros',
    url: 'https://hubros.com.br',
    logo: 'https://hubros.com.br/favicon.png',
    sameAs: ['https://www.instagram.com/hubros.app'],
}

const WEBSITE_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Hubros',
    url: 'https://hubros.com.br',
}

function App() {
    const location = useLocation();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-active');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        // Selecionar todos os blocos relevantes que queremos animar ao rolar
        const revealElements = document.querySelectorAll(`
            .section-title, .section-subtitle, .section-tag,
            .card, .feat-card, .hiw__step, .hiw__visual, 
            .hero__content > *, .hero__qr-card, .cta__box > *,
            .host-banner__inner > *, .footer-grid > *
        `);
        
        revealElements.forEach((el) => {
            el.classList.add('reveal-node');
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, [location.pathname]);

    return (
        <>
            <div className="bg-blobs" aria-hidden="true">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
                <div className="blob blob-gold-1"></div>
                <div className="blob blob-gold-2"></div>
            </div>
            <ScrollToTop />
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Seo
                                path="/"
                                title="Hubros — Seu Espaço de Trabalho Ideal"
                                description="Encontre e reserve espaços de coworking, salas e estúdios com facilidade. A plataforma que conecta profissionais a espaços incríveis."
                                schema={[ORG_SCHEMA, WEBSITE_SCHEMA]}
                            />
                            <Hero />
                            <Spaces />
                            <HowItWorks />
                            <ForHosts />
                            {/* <Testimonials /> */}
                            <CTA />
                        </>
                    } />
                    <Route path="/blog" element={<BlogIndex />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/ajuda" element={
                        <>
                            <Seo path="/ajuda/" title="Central de Ajuda — Hubros" description="Tire suas dúvidas e fale com o time da Hubros. Suporte para encontrar e reservar espaços de trabalho." />
                            <HelpCenter />
                        </>
                    } />
                    <Route path="/sobre" element={
                        <>
                            <Seo path="/sobre/" title="Sobre a Hubros — Redefinindo o espaço de trabalho" description="Conheça a Hubros: conectamos profissionais e empresas a ambientes de trabalho inspiradores, de forma rápida, flexível e sem burocracia." />
                            <About />
                        </>
                    } />
                    <Route path="/cookies" element={
                        <>
                            <Seo path="/cookies/" title="Política de Cookies — Hubros" description="Saiba como a Hubros utiliza cookies para melhorar a sua experiência na plataforma." />
                            <Cookies />
                        </>
                    } />
                    <Route path="/termos" element={
                        <>
                            <Seo path="/termos/" title="Termos de Uso — Hubros" description="Termos de uso da plataforma Hubros." />
                            <Terms />
                        </>
                    } />
                    <Route path="/privacidade" element={
                        <>
                            <Seo path="/privacidade/" title="Política de Privacidade — Hubros" description="Política de privacidade e tratamento de dados da Hubros." />
                            <Privacy />
                        </>
                    } />
                    <Route path="/lista-de-espera" element={
                        <>
                            <Seo path="/lista-de-espera/" title="Lista de Espera — Hubros" description="Entre na lista de espera da Hubros e seja avisado quando lançarmos espaços perto de você." />
                            <Waitlist />
                        </>
                    } />
                </Routes>
            </main>
            <Footer />
            <CookieConsent />
        </>
    )
}

export default App

