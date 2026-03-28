import { useEffect } from 'react'
import './Legal.css'

export default function Cookies() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                        <section>
                            <h2>1. Introdução</h2>
                            <p>
                                A Hubros utiliza cookies e tecnologias semelhantes para aprimorar a experiência do usuário em nossos sites e serviços digitais, atendendo tanto profissionais buscando espaços quanto anfitriões. Esta Política de Cookies explica o que são essas ferramentas, como as utilizamos e como você pode gerenciar ativamente as suas preferências.
                            </p>
                        </section>

                        <section>
                            <h2>2. O que são Cookies?</h2>
                            <p>
                                Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, tablet ou celular) quando você acessa a nossa plataforma. Eles ajudam a lembrar as suas preferências e melhoram substancialmente a sua navegação, garantindo que o seu histórico e filtros (como localização ou tipo de espaço) sejam preservados entre visitas.
                            </p>
                        </section>

                        <section>
                            <h2>3. Tipos de Cookies Utilizados</h2>
                            <p>A Hubros estrutura o uso dos seguintes tipos de cookies para manter o balanço e a segurança do nosso ecossistema:</p>
                            <ul>
                                <li>
                                    <strong>Cookies Necessários:</strong> Estritamente essenciais para o funcionamento seguro da plataforma. Permitem a navegação estrutural, o acesso a áreas restritas da sua conta e a estabilidade durante o pagamento e conclusão de reservas.
                                </li>
                                <li>
                                    <strong>Cookies de Desempenho:</strong> Coletam métricas anônimas sobre como a comunidade interage com nosso site. Isso nos ajuda a otimizar constantemente a performance, corrigir lentidões e melhorar a arquitetura da informação.
                                </li>
                                <li>
                                    <strong>Cookies Funcionais:</strong> Permitem que a plataforma memorize escolhas feitas por você, como o idioma selecionado, região padrão de busca ou preferências visuais do seu painel de controle.
                                </li>
                                <li>
                                    <strong>Cookies de Publicidade:</strong> Utilizados com sutileza para fornecer conteúdo e anúncios mais relevantes para quem busca espaços produtivos ou quer divulgar um ambiente ocioso nas redes sociais, sempre baseados no seu comportamento prévio.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2>4. Como os Cookies São Utilizados?</h2>
                            <p>Os cookies implementados pela engenharia da Hubros são empregados para os seguintes fins:</p>
                            <ul>
                                <li>Melhorar a segurança das conexões de ponta a ponta e fluidez da sua experiência;</li>
                                <li>Personalizar proativamente os espaços em destaque, sugestões e eventuais anúncios;</li>
                                <li>Elaborar análises estatísticas em larga escala sobre o fluxo de acesso, demanda por bairros e uso do site;</li>
                                <li>Facilitar e proteger ativamente o login e a autenticação do seu perfil (seja Coworker ou Cohoster).</li>
                            </ul>
                        </section>

                        <section>
                            <h2>5. Gerenciamento de Cookies</h2>
                            <p>
                                O respeito à sua privacidade é inegociável. Você pode gerenciar, aprovar ou desativar os cookies a qualquer momento diretamente nas configurações de privacidade e segurança do seu navegador. 
                                <br/><br/>
                                No entanto, alertamos que, ao desativar certos cookies (especialmente os Necessários e Funcionais), o desempenho da plataforma pode ser degradado e algumas funcionalidades vitais do sistema de busca ou reserva podem não operar corretamente.
                            </p>
                        </section>

                        <section>
                            <h2>6. Cookies de Terceiros e Parceiros</h2>
                            <p>
                                Nosso ecossistema digital pode utilizar cookies fornecidos por parceiros homologados, como gateways robustos de pagamentos e provedores de análise de tráfego (Analytics). Esses cookies terceirizados são rigidamente processados e estão sujeitos às rigorosas políticas de privacidade dos fornecedores correspondentes.
                            </p>
                        </section>

                        <section>
                            <h2>7. Alterações nesta Política</h2>
                            <p>
                                A Hubros evolui diariamente. Por isso, podemos atualizar esta Política de Cookies periodicamente para adequar-se a novas ferramentas em nuvem, integrações tecnológicas ou regulações legais. Recomendamos que você reserve um momento para visitar esta página regularmente, mantendo-se sempre informado sobre as nossas boas práticas.
                            </p>
                        </section>

                        <div className="legal__contact">
                            <h3>8. Ficou com Dúvidas?</h3>
                            <p>Caso tenha qualquer dúvida ou necessite de esclarecimentos sobre o tratamento dos seus dados mediante esta Política de Cookies, não hesite em falar com o nosso responsável legal através do e-mail: <a href="mailto:contato@hubros.com.br">contato@hubros.com.br</a>.</p>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}
