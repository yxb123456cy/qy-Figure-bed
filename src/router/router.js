import {createRouter, createWebHistory} from 'vue-router'
import Layouts from '../layouts/index.vue'

export const fullScreenViews = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home/index.vue')
    }
]

export const layoutViews = [
    {
        path: '/workbench',
        name: 'layout',
        component: Layouts,
        children: [
            {
                path: '/workbench/upload',
                name: 'upload',
                component: () => import('../views/upload/index.vue')
            },
            {
                path: '/workbench/gallery',
                name: 'gallery',
                component: () => import('../views/gallery/index.vue')
            },
            {
                path: '/workbench/settings',
                name:'settings',
                component: () => import('../views/settings/index.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: [
        /* 全屏页面引入 */
        ...fullScreenViews,
        /* 布局页面引入 */ 
        ...layoutViews,
    ]
})

export default router
