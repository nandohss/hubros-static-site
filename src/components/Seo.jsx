import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://hubros.com.br'
const DEFAULT_IMAGE = `${SITE_URL}/favicon.png`

/**
 * Define título, descrição, canonical e Open Graph por rota.
 * Renderizado dentro de cada rota; o prerender captura o <head> resultante.
 *
 * @param {string} [image] - caminho da imagem social (absoluto ou começando com "/").
 *                           Usado em og:image/twitter:image. Cai no favicon se ausente.
 * @param {string} [type]  - og:type ("website" para páginas, "article" para posts).
 * @param {object|object[]} [schema] - dado(s) structured data JSON-LD (schema.org).
 */
export default function Seo({ title, description, path = '/', image, type = 'website', schema }) {
    const url = `${SITE_URL}${path}`
    const imageUrl = image
        ? (image.startsWith('http') ? image : `${SITE_URL}${image}`)
        : DEFAULT_IMAGE

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={imageUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
            {schema && (
                <script type="application/ld+json">{JSON.stringify(schema)}</script>
            )}
        </Helmet>
    )
}
