import { useEffect } from 'react'
import './Legal.css'

const sections = [
    {
        title: 'Como excluir sua conta pelo app',
        content: (
            <>
                <p>A forma mais rápida de excluir sua conta Hubros é diretamente pelo aplicativo:</p>
                <ol>
                    <li>Abra o app e entre com sua conta;</li>
                    <li>Toque em <strong>Perfil</strong>, no menu inferior;</li>
                    <li>Acesse <strong>Segurança</strong>;</li>
                    <li>Toque em <strong>Excluir conta</strong> e confirme.</li>
                </ol>
                <p>
                    A exclusão é processada imediatamente e não pode ser desfeita: ao confirmar, sua conta e os dados
                    associados a ela são removidos conforme descrito abaixo.
                </p>
            </>
        ),
    },
    {
        title: 'Não tem mais o app instalado?',
        content: (
            <p>
                Você pode pedir a exclusão da sua conta mesmo sem acesso ao aplicativo. Envie um e-mail para{' '}
                <a href="mailto:contato@hubros.com.br">contato@hubros.com.br</a> a partir do endereço cadastrado na
                Hubros, com o assunto <strong>&quot;Exclusão de conta&quot;</strong>, informando o e-mail ou telefone
                usado no cadastro. Confirmamos a identidade do solicitante e processamos a exclusão em até 15 dias.
            </p>
        ),
    },
    {
        title: 'O que é excluído',
        content: (
            <>
                <p>Ao excluir sua conta, removemos permanentemente:</p>
                <ul>
                    <li>Seu login e credenciais de acesso;</li>
                    <li>Dados pessoais armazenados de forma criptografada (CPF, RG, data de nascimento, endereço);</li>
                    <li>Nome, e-mail, apelido e foto de perfil associados à conta;</li>
                    <li>Notificações recebidas no app;</li>
                    <li>O registro do seu dispositivo para envio de notificações push.</li>
                </ul>
            </>
        ),
    },
    {
        title: 'O que é retido e por quê',
        content: (
            <>
                <p>
                    Por obrigação legal e contábil, o histórico de reservas e de pagamentos não é apagado, mas é
                    <strong> desvinculado da sua identidade</strong>: o registro passa a referenciar um identificador
                    anônimo, sem nome, e-mail ou qualquer outro dado que permita identificar você. Essa retenção segue
                    o que permite o Art. 16 da LGPD para cumprimento de obrigação legal ou regulatória (fiscal e de
                    defesa em processos).
                </p>
                <p>
                    Os dados de analytics do app (Amplitude) usam um identificador pseudônimo por dispositivo, não
                    vinculado ao seu nome ou e-mail; a exclusão da conta rompe esse vínculo e gera um novo
                    identificador para o aparelho.
                </p>
            </>
        ),
    },
    {
        title: 'Prazo',
        content: (
            <p>
                Pelo app, a exclusão é imediata. Por e-mail, confirmamos a identidade do solicitante e concluímos o
                processo em até 15 dias corridos.
            </p>
        ),
    },
]

export default function AccountDeletion() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="legal-page">
            <div className="container">
                <main className="legal__container">
                    <header className="legal__header">
                        <div className="section-tag">Documentos Legais</div>
                        <h1 className="legal__title">Exclusão de Conta</h1>
                        <p className="legal__updated">Última atualização: Agosto de 2026</p>
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
                                Para dúvidas sobre a exclusão da sua conta ou o tratamento dos seus dados, entre em
                                contato com nosso responsável legal:{' '}
                                <a href="mailto:contato@hubros.com.br">contato@hubros.com.br</a>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
