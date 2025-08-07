import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Summaries from '@/views/Summaries.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/summaries',
        name: 'summaries',
        component: Summaries,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
