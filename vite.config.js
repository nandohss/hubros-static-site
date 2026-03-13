import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' garante que os assets funcionem corretamente no S3 static hosting
export default defineConfig({
    plugins: [react()],
    base: './',
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
