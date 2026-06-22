import { useParams, Navigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Seo from '../Seo';
import { getPostBySlug } from '../../data/getPosts';
import NewsletterForm from './NewsletterForm';
import './Blog.css';

export default function BlogPost() {
    const { slug } = useParams();
    const post = getPostBySlug(slug);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    const SITE_URL = 'https://hubros.com.br';
    const postUrl = `${SITE_URL}/blog/${post.slug}/`;
    const imageUrl = post.image
        ? (post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`)
        : undefined;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        ...(imageUrl && { image: imageUrl }),
        datePublished: post.date,
        dateModified: post.date,
        author: { '@type': 'Person', name: post.author },
        publisher: {
            '@type': 'Organization',
            name: 'Hubros',
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.png` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    };

    return (
        <article className="section blog-post-section">
            <Seo
                path={`/blog/${post.slug}/`}
                title={`${post.title} — Hubros`}
                description={post.description}
                image={post.image}
                type="article"
                schema={schema}
            />
            
            <div className="container blog-post-container">
                <Link to="/blog" className="blog-post__back">&larr; Voltar para o blog</Link>
                
                <header className="blog-post__header reveal-node reveal-active">
                    {post.image && (
                        <img src={post.image} alt={post.title} className="blog-post__cover" width="1024" height="1024" decoding="async" fetchPriority="high" />
                    )}
                    <h1 className="blog-post__title">{post.title}</h1>
                    <div className="blog-post__meta">
                        <span>Por <strong>{post.author}</strong></span>
                        <span className="blog-post__dot">&bull;</span>
                        <span>{new Date(post.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </header>

                <div className="blog-post__content reveal-node reveal-active">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                <div className="blog-post__newsletter reveal-node reveal-active">
                    <h3 className="blog-post__newsletter-title">Gostou do conteúdo?</h3>
                    <p style={{ marginBottom: 'var(--space-6)' }}>Inscreva-se na nossa newsletter para receber artigos como este em primeira mão.</p>
                    <NewsletterForm />
                </div>
            </div>
        </article>
    );
}
