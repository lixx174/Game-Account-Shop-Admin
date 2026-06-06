import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '@/views/layout/MainLayout.vue'

const routes = [{
    path: '/',
    component: MainLayout,
    redirect: '/game',
    children: [{
            path: 'game',
            name: 'Game',
            component: () =>
                import ('@/views/game/index.vue'),
            meta: { title: '游戏管理', icon: 'AppstoreOutlined' },
        },
        {
            path: 'game-account',
            name: 'GameAccount',
            component: () =>
                import ('@/views/game-account/index.vue'),
            meta: { title: '游戏账号管理', icon: 'UserOutlined' },
        },
        {
            path: 'game-dictionary',
            name: 'GameDictionary',
            component: () =>
                import ('@/views/game-dictionary/index.vue'),
            meta: { title: '游戏字典管理', icon: 'BookOutlined' },
        },
    ],
}, ]

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
})

export default router