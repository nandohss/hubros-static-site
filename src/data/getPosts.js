// src/data/getPosts.js

// Expressão regular simples para extrair o frontmatter em YAML
const frontmatterRegex = /^---\n([\s\S]*?)\n---/;

export function parseFrontmatter(rawContent, slug) {
    const match = rawContent.match(frontmatterRegex);
    let meta = {
        title: slug,
        description: '',
        date: new Date().toISOString().split('T')[0],
        author: 'Hubros',
        category: 'Geral',
        image: ''
    };
    
    let content = rawContent;

    if (match) {
        const yamlStr = match[1];
        // Remove o frontmatter do conteúdo
        content = rawContent.slice(match[0].length).trim();
        
        // Faz um parse simples do YAML (suporta chaves simples: valor)
        yamlStr.split('\n').forEach(line => {
            const idx = line.indexOf(':');
            if (idx > -1) {
                const key = line.slice(0, idx).trim();
                let value = line.slice(idx + 1).trim();
                // Remove aspas caso tenha
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                } else if (value.startsWith("'") && value.endsWith("'")) {
                    value = value.slice(1, -1);
                }
                meta[key] = value;
            }
        });
    }

    return { meta, content };
}

// Carrega todos os arquivos .md da pasta blog
const markdownFiles = import.meta.glob('./blog/*.md', { query: '?raw', import: 'default', eager: true });

export function getAllPosts() {
    const posts = [];

    for (const path in markdownFiles) {
        const slug = path.split('/').pop().replace('.md', '');
        const rawContent = markdownFiles[path];
        
        const { meta, content } = parseFrontmatter(rawContent, slug);
        
        posts.push({
            slug,
            ...meta,
            content
        });
    }

    // Ordena por data (mais recente primeiro)
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
    const posts = getAllPosts();
    return posts.find(p => p.slug === slug);
}
