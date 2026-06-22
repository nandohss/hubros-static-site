import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: '/' (absoluto) para os assets resolverem a partir de qualquer rota,
// inclusive as pré-renderizadas em subdiretório (ex.: /sobre/).
export default defineConfig({
    plugins: [react()],
    base: '/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                },
            },
        },
    },
})
