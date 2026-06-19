import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const PORT = 4178
const ORIGIN = `http://localhost:${PORT}`
const DIST = fileURLToPath(new URL('../dist', import.meta.url))
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// Rotas a pré-renderizar (precisa espelhar as <Route> em src/App.jsx).
const ROUTES = ['/', '/ajuda', '/sobre', '/cookies', '/termos', '/privacidade', '/lista-de-espera']

async function waitForServer(url, timeoutMs = 20000) {
    const start = Date.now()
    while (Date.now() - start < timeoutMs) {
        try {
            const res = await fetch(url)
            if (res.ok) return
        } catch {
            // servidor ainda subindo
        }
        await new Promise((r) => setTimeout(r, 250))
    }
    throw new Error(`Servidor de preview não respondeu em ${timeoutMs}ms`)
}

async function main() {
    const server = spawn(
        'npx',
        ['vite', 'preview', '--port', String(PORT), '--strictPort'],
        { stdio: 'ignore', cwd: fileURLToPath(new URL('..', import.meta.url)) }
    )

    try {
        await waitForServer(ORIGIN)

        const browser = await puppeteer.launch({
            executablePath: CHROME,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        })
        const page = await browser.newPage()

        for (const route of ROUTES) {
            await page.goto(ORIGIN + route, { waitUntil: 'networkidle0' })
            // Garante que o React montou e o Helmet definiu o <title>.
            await page.waitForFunction(
                () => document.querySelector('#root')?.childElementCount > 0 && !!document.title,
                { timeout: 15000 }
            )
            const html = await page.evaluate(
                () => '<!doctype html>\n' + document.documentElement.outerHTML
            )
            const outPath =
                route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html')
            await mkdir(dirname(outPath), { recursive: true })
            await writeFile(outPath, html, 'utf8')
            console.log(`✓ prerender ${route} → ${outPath.replace(DIST, 'dist')}`)
        }

        await browser.close()
    } finally {
        server.kill('SIGTERM')
    }
}

main().catch((err) => {
    console.error('Falha no prerender:', err)
    process.exit(1)
})
