import { useEffect } from 'react'
import './Legal.css'

const sections = [
    {
        title: 'Introdução',
        content: (
            <p>
                A Hubros utiliza cookies e tecnologias semelhantes para aprimorar a experiência do usuário em nossos sites e serviços digitais, atendendo tanto profissionais buscando espaços quanto anfitriões. Esta Política de Cookies explica o que são essas ferramentas, como as utilizamos e como você pode gerenciar ativamente as suas preferências.
            </p>
        ),
    },
    {
        title: 'O que são Cookies?',
        content: (
            <p>
                Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, tablet ou celular) quando você acessa a nossa plataforma. Eles ajudam a lembrar as suas preferências e melhoram substancialmente a sua navegação, garantindo que o seu histórico e filtros (como localização ou tipo de espaço) sejam preservados entre visitas.
            </p>
        ),
    },
    {
        title: 'Tipos de Cookies Utilizados',
        content: (
            <>
                <p>A Hubros estrutura o uso dos seguintes tipos de cookies:</p>
                <ul>
                    <li><strong>Cookies Necessários:</strong> Estritamente essenciais para o funcionamento seguro da plataforma. Permitem a navegação estrutural, o acesso a áreas restritas da sua conta e a estabilidade durante o pagamento e conclusão de reservas.</li>
                    <li><strong>Cookies de Desempenho:</strong> Coletam métricas anônimas sobre como a comunidade interage com nosso site, ajudando a otimizar a performance e corrigir lentidões.</li>
                    <li><strong>Cookies Funcionais:</strong> Permitem que a plataforma memorize escolhas feitas por você, como idioma selecionado, região padrão de busca ou preferências visuais.</li>
                    <li><strong>Cookies de Publicidade:</strong> Utilizados para fornecer conteúdo e anúncios mais relevantes, sempre baseados no seu comportamento prévio.</li>
                </ul>
            </>
        ),
    },
    {
        title: 'Como os Cookies São Utilizados?',
        content: (
            <>
                <p>Os cookies implementados pela Hubros são empregados para:</p>
                <ul>
                    <li>Melhorar a segurança das conexões e a fluidez da sua experiência;</li>
                    <li>Personalizar os espaços em destaque, sugestões e eventuais anúncios;</li>
                    <li>Elaborar análises estatísticas sobre o fluxo de acesso, demanda por bairros e uso do site;</li>
                    <li>Facilitar e proteger o login e a autenticação do seu perfil.</li>
                </ul>
            </>
        ),
    },
    {
        title: 'Gerenciamento de Cookies',
        content: (
            <p>
                O respeito à sua privacidade é inegociável. Você pode gerenciar, aprovar ou desativar os cookies a qualquer momento diretamente nas configurações de privacidade do seu navegador. No entanto, ao desativar certos cookies — especialmente os Necessários e Funcionais — o desempenho da plataforma pode ser degradado e algumas funcionalidades de busca ou reserva podem não operar corretamente.
            </p>
        ),
    },
    {
        title: 'Cookies de Terceiros e Parceiros',
        content: (
            <p>
                Nosso ecossistema digital pode utilizar cookies fornecidos por parceiros homologados, como gateways de pagamentos e provedores de análise de tráfego. Esses cookies terceirizados são processados e estão sujeitos às políticas de privacidade dos fornecedores correspondentes.
            </p>
        ),
    },
    {
        title: 'Alterações nesta Política',
        content: (
            <p>
                A Hubros evolui diariamente. Por isso, podemos atualizar esta Política de Cookies periodicamente para adequar-se a novas ferramentas, integrações tecnológicas ou regulações legais. Recomendamos visitar esta página regularmente para se manter informado.
            </p>
        ),
    },
]

export default function Cookies() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="legal-page">
            <div className="container">
                <main className="legal__container">
                    <header className="legal__header">
                        <div className="section-tag">Documentos Legais</div>
                        <h1 className="legal__title">Política de Cookies</h1>
                        <p className="legal__updated">Última atualização: Março de 2026</p>
                    </header>

                    <div className="legal__content">
                        {sections.map((s, i) => (
                            <section key={i}>
                                <h2>{i + 1}. {s.title}</h2>
                                {s.content}
                            </section>
                        ))}

                        <div className="legal__contact">
                            <h3>Ficou com Dúvidas?</h3>
                            <p>
                                Caso tenha qualquer dúvida sobre o tratamento dos seus dados mediante esta Política de Cookies, entre em contato com o nosso responsável legal:{' '}
                                <a href="mailto:contato@hubros.com.br">contato@hubros.com.br</a>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
