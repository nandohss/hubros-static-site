import './ForHosts.css'

// As métricas antigas (R$ 3.200/mês, até 80%, ocupação por categoria) saíram:
// não tinham fonte. Só voltam com dado real.
const perks = [
    'Cadastro gratuito e configuração em minutos',
    'Controle total de preços, horários e disponibilidade',
    'Receba automaticamente via Pix ou transferência bancária',
    'Dashboard completo com visão de receitas e ocupação',
]

export default function ForHosts() {
    return (
        <section className="forhosts on-ink" id="hosts">
            <div className="container">
                <p className="home-label forhosts__label">Para hosts</p>
                <h2 className="forhosts__title">
                    Seu espaço vazio <span>pode virar renda recorrente.</span>
                </h2>

                <div className="forhosts__row">
                    <div>
                        <p className="forhosts__desc">
                            Clínicas, escritórios, estúdios e salões ficam vazios horas por dia.
                            Na Hubros, cada hora vazia vira oportunidade real de receita, sem esforço.
                        </p>
                        <div className="forhosts__cta">
                            <a href="/cadastrar-espaco/" className="btn forhosts__btn">Cadastrar meu espaço</a>
                            <small>Cadastro gratuito</small>
                        </div>
                    </div>

                    <ol className="forhosts__perks">
                        {perks.map((perk, i) => (
                            <li key={perk}>
                                <span className="forhosts__num">{String(i + 1).padStart(2, '0')}</span>
                                {perk}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    )
}
