import { APP_STORE_URL } from '../StoreBadges/StoreBadges'
import './Spaces.css'

// Espaços no ar em prod (out/2026): completos, ligados e com carteira ativa em
// prod-coworking-spaces. category/subcategory = `categoria`/`subcategoria` do item.
// Fotos = capa do app recortada em 4:5 em public/spaces/.
// Lista fixa de propósito, para entrar no HTML pré-renderizado; atualizar à mão
// quando um espaço entrar ou sair do marketplace.
const SPACES = [
    {
        name: 'Travessia Espaço Analítico',
        category: 'Saúde e Bem-estar',
        subcategory: 'Psicologia',
        place: 'Cerqueira César, São Paulo',
        pricePerHour: 98,
        photo: '/spaces/travessia.jpg',
    },
    {
        name: 'Recriando Consultórios',
        category: 'Saúde e Bem-estar',
        subcategory: 'Psicologia',
        place: 'Jardim Santa Rosália, Sorocaba',
        pricePerHour: 65,
        photo: '/spaces/recriando.jpg',
    },
    {
        name: 'NCEI Coffee Lounge',
        category: 'Escritório e Negócios',
        subcategory: 'Sala de reunião',
        place: 'Nova Petrópolis, São Bernardo do Campo',
        pricePerHour: 80,
        photo: '/spaces/ncei.jpg',
    },
    {
        name: 'Integrar · Comunicação é Bem-estar',
        category: 'Saúde e Bem-estar',
        subcategory: 'Psicologia',
        place: 'Jardim Promissão, São Paulo',
        pricePerHour: 50,
        photo: '/spaces/integrar.jpg',
    },
]

export default function Spaces() {
    return (
        <section className="spaces" id="spaces">
            <div className="container home-split">
                <div className="spaces__head">
                    <p className="home-label">Espaços</p>
                    <h2 className="home-h2">Espaços incríveis perto de você.</h2>
                    <p className="home-lead">Consultórios e salas de reunião já disponíveis para reservar por hora no app, com pagamento por PIX ou cartão.</p>
                    <a href={APP_STORE_URL} className="btn btn-primary spaces__all">Ver todos os espaços no app</a>
                </div>

                <ul className="spaces__grid">
                    {SPACES.map(space => (
                        <li key={space.name}>
                            <a href={APP_STORE_URL} className="spaces__card">
                                <div className="spaces__photo">
                                    <img src={space.photo} alt={`${space.name}, ${space.subcategory.toLowerCase()} em ${space.place}`} width="720" height="900" loading="lazy" decoding="async" />
                                    <span className="spaces__sub">{space.subcategory}</span>
                                </div>
                                <p className="spaces__cat">{space.category}</p>
                                <h3 className="spaces__name">{space.name}</h3>
                                <p className="spaces__place">{space.place}</p>
                                <p className="spaces__price">a partir de <strong>R$ {space.pricePerHour}</strong>/hora</p>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
