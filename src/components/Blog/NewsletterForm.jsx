import { useState } from 'react';
import './NewsletterForm.css';

export default function NewsletterForm() {
    const [status, setStatus] = useState('idle'); // idle, loading, success

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('loading');
        
        // Simula o tempo de rede para uma requisição de cadastro de email
        setTimeout(() => {
            setStatus('success');
        }, 1200);
    };

    return (
        <div className="newsletter-form-wrapper">
            {status === 'success' ? (
                <div className="newsletter-success">
                    <svg className="newsletter-icon-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4>Inscrição confirmada!</h4>
                    <p>Em breve você começará a receber nossos melhores conteúdos.</p>
                </div>
            ) : (
                <form className="newsletter-form" onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        required 
                        placeholder="Seu melhor e-mail..." 
                        className="newsletter-input"
                        disabled={status === 'loading'}
                    />
                    <button 
                        type="submit" 
                        className={`btn btn-primary newsletter-submit ${status === 'loading' ? 'loading' : ''}`}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Assinando...' : 'Assinar'}
                    </button>
                </form>
            )}
        </div>
    );
}
