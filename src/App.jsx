import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Features from './components/Features/Features'
import AppPreview from './components/AppPreview/AppPreview'
import HowItWorks from './components/HowItWorks/HowItWorks'
import CTA from './components/CTA/CTA'
import Footer from './components/Footer/Footer'

function App() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Features />
                <AppPreview />
                <HowItWorks />
                <CTA />
            </main>
            <Footer />
        </>
    )
}

export default App
