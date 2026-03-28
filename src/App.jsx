import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Features from './components/Features/Features'
import AppPreview from './components/AppPreview/AppPreview'
import HowItWorks from './components/HowItWorks/HowItWorks'
import CTA from './components/CTA/CTA'
import HelpCenter from './components/HelpCenter/HelpCenter'
import About from './components/About/About'
import Cookies from './components/Legal/Cookies'
import CookieConsent from './components/Legal/CookieConsent'
import Footer from './components/Footer/Footer'

function App() {
    return (
        <>
            <ScrollToTop />
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Hero />
                            <Features />
                            <AppPreview />
                            <HowItWorks />
                            <CTA />
                        </>
                    } />
                    <Route path="/ajuda" element={<HelpCenter />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/cookies" element={<Cookies />} />
                </Routes>
            </main>
            <Footer />
            <CookieConsent />
        </>
    )
}

export default App
