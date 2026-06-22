import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../Seo';
import { getAllPosts } from '../../data/getPosts';
import NewsletterForm from './NewsletterForm';
import './Blog.css';

const CATEGORIES = [
    'Todos',
    'Dicas para Hosts',
    'Carreira & Produtividade',
    'Nichos & Atendimento',
    'IA & Inovação',
    'Bastidores'
];

export default function BlogIndex() {
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const allPosts = getAllPosts();

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);
    
    // Filtra os posts baseado na categoria e no termo de pesquisa
    const filteredPosts = allPosts.filter(post => {
        const matchCategory = activeCategory === 'Todos' || post.category === activeCategory;
        const matchSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            post.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    // Só exibe post em destaque se não estiver pesquisando e estiver na primeira página (simplificado)
    const featuredPost = (searchTerm === '' && activeCategory === 'Todos') ? filteredPosts[0] : null;
    
    // Os outros posts são o restante
    const otherPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

    return (
        <section className="section blog-section">
            <Seo 
                path="/blog/" 
                title="Blog — Hubros | Ecossistema de Produtividade" 
                description="Conteúdos práticos sobre IA, negócios, carreira e gestão de espaços. Transforme a maneira como você trabalha." 
            />
            <div className="container blog-container-sidebar">
                
                {/* BARRA LATERAL (SIDEBAR) — Desktop */}
                <aside className="blog-sidebar reveal-node reveal-active">
                    <div className="blog-sidebar-sticky">
                        <div className="blog-search-box">
                            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input 
                                type="text" 
                                placeholder="Pesquisar artigos..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Dropdown Mobile */}
                        <div className="blog-category-dropdown" ref={dropdownRef}>
                            <button 
                                className="blog-category-dropdown__trigger"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                aria-expanded={dropdownOpen}
                            >
                                <span>{activeCategory}</span>
                                <svg className={`dropdown-chevron ${dropdownOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                            {dropdownOpen && (
                                <div className="blog-category-dropdown__menu">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            className={`blog-category-dropdown__item ${activeCategory === cat ? 'active' : ''}`}
                                            onClick={() => {
                                                setActiveCategory(cat);
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            {cat}
                                            {activeCategory === cat && (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Lista Desktop */}
                        <div className="blog-categories-sidebar">
                            <h4 className="sidebar-title">Tópicos</h4>
                            {CATEGORIES.map(cat => (
                                <button 
                                    key={cat}
                                    className={`sidebar-category ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* CONTEÚDO PRINCIPAL */}
                <main className="blog-main">
                    
                    {(searchTerm === '' && activeCategory === 'Todos') && (
                        <div className="blog-header reveal-node reveal-active">
                            <span className="section-tag">Hub de Produtividade</span>
                            <h1 className="section-title" style={{ textAlign: 'left', margin: 'var(--space-2) 0' }}>Evolua sua Carreira e Negócio</h1>
                            <p className="section-subtitle" style={{ textAlign: 'left', margin: '0 0 var(--space-8) 0', maxWidth: '100%' }}>
                                Conteúdos práticos sobre produtividade, negócios e gestão de espaços. Transforme a maneira como você trabalha e rentabiliza.
                            </p>
                        </div>
                    )}

                    {featuredPost && (
                        <div className="blog-featured reveal-node reveal-active">
                            {featuredPost.image && (
                                <Link to={`/blog/${featuredPost.slug}`} className="blog-featured__image-link">
                                    <img src={featuredPost.image} alt={featuredPost.title} className="blog-featured__image" width="1024" height="1024" decoding="async" fetchPriority="high" />
                                </Link>
                            )}
                            <div className="blog-featured__content">
                                <div className="blog-card__meta">
                                    <span className="blog-card__tag">{featuredPost.category}</span>
                                    <span>&bull;</span>
                                    <span className="blog-card__date">
                                        {new Date(featuredPost.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <h2 className="blog-featured__title">
                                    <Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                                </h2>
                                <p className="blog-featured__desc">{featuredPost.description}</p>
                                <Link to={`/blog/${featuredPost.slug}`} className="btn btn-primary">Ler Artigo Completo</Link>
                            </div>
                        </div>
                    )}

                    {filteredPosts.length === 0 ? (
                        <div className="blog-empty-state">
                            <p>Nenhum artigo encontrado para a sua pesquisa.</p>
                        </div>
                    ) : (
                        <div className="blog-grid">
                            {otherPosts.map(post => (
                                <Link to={`/blog/${post.slug}`} className="blog-card reveal-node reveal-active" key={post.slug}>
                                    {post.image && (
                                        <div className="blog-card__image-container">
                                            <img src={post.image} alt={post.title} className="blog-card__image" width="1024" height="1024" loading="lazy" decoding="async" />
                                        </div>
                                    )}
                                    <div className="blog-card__body">
                                        <div className="blog-card__meta">
                                            <span className="blog-card__date">
                                                {new Date(post.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                            <span>&bull;</span>
                                            <span className="blog-card__tag" style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                                                {post.category}
                                            </span>
                                        </div>
                                        <h3 className="blog-card__title">{post.title}</h3>
                                        <p className="blog-card__desc">{post.description}</p>
                                        <span className="blog-card__readmore">Ler artigo &rarr;</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="blog-newsletter-section reveal-node reveal-active">
                        <h3>Assine nossa Newsletter</h3>
                        <p>Receba nossos melhores artigos diretamente no seu e-mail.</p>
                        <NewsletterForm />
                    </div>
                </main>
            </div>
        </section>
    );
}
