import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://hubros.com.br'

/**
 * Define título, descrição, canonical e Open Graph por rota.
 * Renderizado dentro de cada rota; o prerender captura o <head> resultante.
 */
export default function Seo({ title, description, path = '/' }) {
    const url = `${SITE_URL}${path}`

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    )
}
