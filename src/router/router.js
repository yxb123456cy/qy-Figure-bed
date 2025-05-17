import {createRouter, createWebHistory} from 'vue-router'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/home/Home.vue')
        },
        {
            path: '/gallery',
            name: 'gallery',
            component: () => import('../views/gallery/Gallery.vue')
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import('../views/settings/Settings.vue')
        }
    ]
})

export default router 