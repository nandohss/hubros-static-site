import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

// O HTML pré-renderizado (build) serve para crawlers/SEO; no cliente o React
// re-renderiza sobre ele via createRoot (evita mismatch de hidratação com as
// classes de animação adicionadas em runtime).
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </HelmetProvider>
    </StrictMode>,
)
