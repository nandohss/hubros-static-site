import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Spaces from './components/Spaces/Spaces'
import Features from './components/Features/Features'
import HowItWorks from './components/HowItWorks/HowItWorks'
import ForHosts from './components/ForHosts/ForHosts'
import Testimonials from './components/Testimonials/Testimonials'
import Waitlist from './components/Waitlist/Waitlist'
import CTA from './components/CTA/CTA'
import HelpCenter from './components/HelpCenter/HelpCenter'
import About from './components/About/About'
import Cookies from './components/Legal/Cookies'
import Terms from './components/Legal/Terms'
import Privacy from './components/Legal/Privacy'
import CookieConsent from './components/Legal/CookieConsent'
import Footer from './components/Footer/Footer'

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
            </div>
            <ScrollToTop />
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Hero />
                            <Spaces />
                            <HowItWorks />
                            <ForHosts />
                            <Testimonials />
                            <CTA />
                        </>
                    } />
                    <Route path="/ajuda" element={<HelpCenter />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="/termos" element={<Terms />} />
                    <Route path="/privacidade" element={<Privacy />} />
                    <Route path="/lista-de-espera" element={<Waitlist />} />
                </Routes>
            </main>
            <Footer />
            <CookieConsent />
        </>
    )
}

export default App

