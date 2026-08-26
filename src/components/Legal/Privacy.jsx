import { useEffect } from 'react'
import './Legal.css'

const PRIVACY_PDF_URL = 'https://amplifycoworkingappb1e516e5e7f54784b0eff05a3d518a9eb-staging.s3.sa-east-1.amazonaws.com/public/legal/politica_privacidade_hubros.pdf'

export default function Privacy() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="legal-page">
            <div className="container">
                <main className="legal__container">
                    <header className="legal__header">
                        <div className="section-tag">Documentos Legais</div>
                        <h1 className="legal__title">Política de Privacidade</h1>
                        <p className="legal__updated">Última atualização: 20 de julho de 2026</p>
                    </header>

                    <div className="legal__content">
                        <div className="legal__pdf-wrapper">
                            <a
                                href={PRIVACY_PDF_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="legal__pdf-download"
                            >
                                ↓ Baixar PDF
                            </a>
                            <iframe
                                src={PRIVACY_PDF_URL}
                                title="Política de Privacidade Hubros"
                                className="legal__pdf-frame"
                            />
                            <p className="legal__pdf-fallback">
                                Não consegue visualizar?{' '}
                                <a href={PRIVACY_PDF_URL} target="_blank" rel="noopener noreferrer">
                                    Abrir PDF em nova aba
                                </a>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
