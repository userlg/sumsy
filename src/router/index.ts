import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Summaries from '@/views/Summaries.vue'
import Cases from '@/views/Cases.vue'

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
    {
        path: '/cases',
        name: 'cases',
        component: Cases,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
