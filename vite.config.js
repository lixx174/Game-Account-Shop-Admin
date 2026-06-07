import {
    defineConfig,
    loadEnv
} from 'vite'
import vue from '@vitejs/plugin-vue'
import {
    resolve
} from 'path'

export default defineConfig(({
    mode
}) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        base: env.VITE_APP_BASE || '/',
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
                    target: 'https://qinghaotech.com',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/admin/, '/admin'),
                    configure: (proxy, options) => {
                        proxy.on('proxyReq', (proxyReq, req) => {
                            console.log('代理请求:', req.url, '→', proxyReq.path)
                        })
                    }
                }
            }
        },

    }
})