import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    base: '/Game-Account-Shop-App/',
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/admin': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
        },
    },
})