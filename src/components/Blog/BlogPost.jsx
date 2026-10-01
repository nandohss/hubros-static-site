import { useMemo, useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Seo from '../Seo';
import { getPostBySlug } from '../../data/getPosts';
import NewsletterForm from './NewsletterForm';
import './Blog.css';
import './HubrosBlocks.css';
import './hubrosBlocks.js';

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

        // Bloco HTML com âncora própria entra no índice como subitem:
        // <section id="calculadora" data-toc="Calculadora" ...>
        const block = /^<\w+[^>]*\bid="([^"]+)"[^>]*\bdata-toc="([^"]+)"/.exec(line);
        if (block) {
            headings.push({ level: 3, text: block[2], id: block[1] });
            continue;
        }

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

// Monta o schema FAQPage a partir da seção "## Perguntas frequentes" (### pergunta + parágrafo de resposta).
function extractFaq(markdown) {
    const start = markdown.search(/^##\s+Perguntas frequentes\s*$/m);
    if (start === -1) return null;
    const items = [];
    const parts = markdown.slice(start).split(/^###\s+/m).slice(1);
    for (const part of parts) {
        const [question, ...rest] = part.split('\n');
        const answer = rest.join(' ').replace(/\s+/g, ' ').trim();
        if (question.trim() && answer) {
            items.push({
                '@type': 'Question',
                name: question.trim(),
                acceptedAnswer: { '@type': 'Answer', text: answer },
            });
        }
    }
    return items.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items } : null;
}

// Injeta os mesmos ids/âncoras nos headings renderizados pelo markdown.
const markdownComponents = {
    h2: ({ children }) => <h2 id={slugify(getNodeText(children))}>{children}</h2>,
    h3: ({ children }) => <h3 id={slugify(getNodeText(children))}>{children}</h3>,
    a: ({ href, children }) => (
        /^https?:/.test(href || '')
            ? <a href={href} target="_blank" rel="noopener">{children}</a>
            : <a href={href}>{children}</a>
    ),
};

function TocList({ headings, activeId, onPick }) {
    return (
        <ul className="blog-post__toc-list">
            {headings.map((h) => (
                <li
                    key={h.id}
                    className={`blog-post__toc-item blog-post__toc-item--h${h.level}${activeId === h.id ? ' is-active' : ''}`}
                >
                    <a href={`#${h.id}`} onClick={onPick}>{h.text}</a>
                </li>
            ))}
        </ul>
    );
}

// Desktop: coluna lateral fixa. Some abaixo de 1100px (ver Blog.css).
function TableOfContents({ headings, activeId }) {
    return (
        <aside className="blog-post__toc-wrap">
            <nav className="blog-post__toc" aria-label="Nesta página">
                <p className="blog-post__toc-title">Nesta página</p>
                <TocList headings={headings} activeId={activeId} />
            </nav>
        </aside>
    );
}

// Mobile/tablet: índice recolhido acima do texto; fecha ao escolher uma seção.
function TableOfContentsMobile({ headings, activeId }) {
    const [open, setOpen] = useState(false);
    return (
        <details
            className="blog-post__toc-mobile"
            open={open}
            onToggle={(e) => setOpen(e.currentTarget.open)}
        >
            <summary>
                <span>Nesta página</span>
                <span className="blog-post__toc-mobile-count">{headings.filter((h) => h.level === 2).length} seções</span>
            </summary>
            <nav aria-label="Nesta página">
                <TocList headings={headings} activeId={activeId} onPick={() => setOpen(false)} />
            </nav>
        </details>
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

    // Memoizado: o script dos blocos mexe no DOM (contagem, steppers), então o
    // markdown não deve re-renderizar a cada mudança de seção ativa no índice.
    const body = useMemo(
        () => (post ? <ReactMarkdown components={markdownComponents} rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown> : null),
        [post?.content]
    );

    // Blocos interativos (calculadora, funil, checklist) são HTML cru no markdown:
    // o script os ativa depois que o post monta.
    useEffect(() => {
        if (post && window.hubrosBlogInit) window.hubrosBlogInit();
    }, [post?.slug]);

    // Link direto para uma seção (ex.: #calculadora): o conteúdo monta depois do
    // load, então o navegador não rola sozinho. Rola quando o alvo existir.
    useEffect(() => {
        const id = decodeURIComponent(window.location.hash.slice(1));
        if (!post || !id) return;
        const t = setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ block: 'start' });
        }, 60);
        return () => clearTimeout(t);
    }, [post?.slug]);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    const hasToc = headings.length >= 2;

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
    const faqSchema = extractFaq(post.content);

    return (
        <article className="section blog-post-section">
            <Seo
                path={`/blog/${post.slug}/`}
                title={post.seoTitle || `${post.title} — Hubros`}
                description={post.description}
                image={post.image}
                type="article"
                schema={faqSchema ? [schema, faqSchema] : schema}
            />

            <div className={`container blog-post-container${hasToc ? ' blog-post-container--with-toc' : ''}`}>
                <Link to="/blog" className="blog-post__back">&larr; Voltar para o blog</Link>

                <header className="blog-post__header reveal-node reveal-active">
                    {post.image && (
                        <img src={post.image} alt={post.imageAlt || post.title} className="blog-post__cover" width="1024" height="1024" decoding="async" fetchPriority="high" />
                    )}
                    <h1 className="blog-post__title">{post.title}</h1>
                    <div className="blog-post__meta">
                        <span>Por <strong>{post.author}</strong></span>
                        <span className="blog-post__dot">&bull;</span>
                        <span>{new Date(`${post.date}T12:00:00`).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </header>

                <div className="blog-post__layout">
                    <div className="blog-post__main">
                        {hasToc && <TableOfContentsMobile headings={headings} activeId={activeId} />}
                        <div className="blog-post__content reveal-node reveal-active">
                            {body}
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
