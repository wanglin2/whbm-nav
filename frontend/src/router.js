import { createRouter, createWebHashHistory } from 'vue-router';
import Index from '@/pages/index';

const routes = [
    { 
        path: '/', 
        redirect: '/index' 
    },
    { 
        path: '/index/:chapters*', 
        component: Index,
    },
    { 
        path: '/cms', 
        component: () => import('@/pages/cms'),
    },
    { 
        path: '/dev', 
        component: () => import('@/pages/dev'),
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router