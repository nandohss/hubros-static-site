import { APP_STORE_URL } from '../StoreBadges/StoreBadges'
import './Spaces.css'

// Categorias reais do app. `hidden` tira da home sem apagar — Estúdios e
// salões fica fora por enquanto (out/2026).
const CATEGORIES = [
    { name: 'Escritórios e salas de reunião' },
    { name: 'Consultórios e clínicas' },
    { name: 'Estúdios e salões', hidden: true },
    { name: 'Eventos' },
]

export default function Spaces() {
    const visible = CATEGORIES.filter(c => !c.hidden)

    return (
        <section className="spaces" id="spaces">
            <div className="container home-split">
                <div className="spaces__head">
                    <p className="home-label">Espaços</p>
                    <h2 className="home-h2">Espaços incríveis perto de você.</h2>
                    <p className="home-lead">Dezenas de espaços verificados e avaliados pela comunidade esperando por você.</p>
                </div>

                <div>
                    <ol className="spaces__index">
                        {visible.map((cat, i) => (
                            <li key={cat.name}>
                                <a href={APP_STORE_URL}>
                                    <span className="spaces__num">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="spaces__name">{cat.name}</span>
                                    <span className="spaces__go">Ver no app →</span>
                                </a>
                            </li>
                        ))}
                    </ol>
                    <a href={APP_STORE_URL} className="btn btn-primary spaces__all">Ver todos os espaços no app</a>
                </div>
            </div>
        </section>
    )
}
