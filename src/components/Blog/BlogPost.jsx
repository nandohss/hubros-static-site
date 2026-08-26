import { useMemo, useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Seo from '../Seo';
import { getPostBySlug } from '../../data/getPosts';
import NewsletterForm from './NewsletterForm';
import './Blog.css';

// Gera um id/âncora estável a partir do texto de um heading (compatível com pt-BR).
function slugify(text) {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')   // remove acentos
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')      // remove pontuação
        .replace(/\s+/g, '-')              // espaços -> hífen
        .replace(/-+/g, '-');
}

// Extrai o texto puro de um nó do ReactMarkdown (children pode ser string ou array de nós).
function getNodeText(node) {
    if (node == null) return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getNodeText).join('');
    if (typeof node === 'object' && node.props) return getNodeText(node.props.children);
    return '';
}

// Percorre o markdown e coleta os headings ## (nível 2) e ### (nível 3), ignorando blocos de código.
function extractHeadings(markdown) {
    const headings = [];
    let insideFence = false;

    for (const rawLine of markdown.split('\n')) {
        const line = rawLine.trim();

        if (line.startsWith('```')) {
            insideFence = !insideFence;
            continue;
        }
        if (insideFence) continue;

        const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
        if (!match) continue;

        // Remove marcações inline (negrito, itálico, código, links) para o texto de exibição.
        const text = match[2]
            .replace(/\*\*|__|\*|_|`/g, '')
            .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
            .trim();

        headings.push({
            level: match[1].length,
            text,
            id: slugify(text),
        });
    }

    return headings;
}

// Destaca a seção atual no índice: a ativa é o último heading cujo topo já
// cruzou uma linha de referência abaixo da navbar. Abordagem baseada em scroll
// (mais estável que IntersectionObserver em seções longas), com throttle via rAF.
function useActiveHeading(ids) {
    const [activeId, setActiveId] = useState('');
    const key = ids.join('|');

    useEffect(() => {
        if (!ids.length) return;

        const elements = ids
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        if (!elements.length) return;

        const navHeight =
            parseInt(
                getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
                10
            ) || 72;
        const offset = navHeight + 48; // alinha com o scroll-margin-top dos headings

        let ticking = false;

        const compute = () => {
            ticking = false;

            // Seção atual = último heading cujo topo já cruzou a linha de referência.
            // getBoundingClientRect().top é sempre relativo à viewport, então funciona
            // independentemente de qual elemento (html/body) realmente faz a rolagem —
            // por isso não dependemos de scrollTop/scrollHeight, que ficam pouco
            // confiáveis com overflow: clip no root.
            let current = elements[0].id;
            for (const el of elements) {
                if (el.getBoundingClientRect().top - offset <= 0) {
                    current = el.id;
                } else {
                    break;
                }
            }
            setActiveId(current);
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(compute);
        };

        compute();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [key]);

    return activeId;
}

function TableOfContents({ headings, activeId }) {
    return (
        <aside className="blog-post__toc-wrap">
            <nav className="blog-post__toc" aria-label="Nesta página">
                <p className="blog-post__toc-title">Nesta página</p>
                <ul className="blog-post__toc-list">
                    {headings.map((h) => (
                        <li
                            key={h.id}
                            className={`blog-post__toc-item blog-post__toc-item--h${h.level}${activeId === h.id ? ' is-active' : ''}`}
                        >
                            <a href={`#${h.id}`}>{h.text}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default function BlogPost() {
    const { slug } = useParams();
    const post = getPostBySlug(slug);

    const headings = useMemo(
        () => (post ? extractHeadings(post.content) : []),
        [post?.content]
    );
    const activeId = useActiveHeading(headings.map((h) => h.id));

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    const hasToc = headings.length >= 2;

    // Injeta os mesmos ids/âncoras nos headings renderizados pelo markdown.
    const markdownComponents = {
        h2: ({ children }) => <h2 id={slugify(getNodeText(children))}>{children}</h2>,
        h3: ({ children }) => <h3 id={slugify(getNodeText(children))}>{children}</h3>,
    };

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

            <div className={`container blog-post-container${hasToc ? ' blog-post-container--with-toc' : ''}`}>
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

                <div className="blog-post__layout">
                    <div className="blog-post__main">
                        <div className="blog-post__content reveal-node reveal-active">
                            <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
                        </div>

                        <div className="blog-post__newsletter reveal-node reveal-active">
                            <h3 className="blog-post__newsletter-title">Gostou do conteúdo?</h3>
                            <p style={{ marginBottom: 'var(--space-6)' }}>Inscreva-se na nossa newsletter para receber artigos como este em primeira mão.</p>
                            <NewsletterForm />
                        </div>
                    </div>

                    {hasToc && <TableOfContents headings={headings} activeId={activeId} />}
                </div>
            </div>
        </article>
    );
}
