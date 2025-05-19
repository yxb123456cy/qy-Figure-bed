import {createRouter, createWebHistory} from 'vue-router'
import Layouts from '../layouts/index.vue'

export const fullScreenViews = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home/Home.vue')
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
                component: () => import('../views/upload/Upload.vue')
            },
            {
                path: '/workbench/gallery',
                name: 'gallery',
                component: () => import('../views/gallery/Gallery.vue')
            },
            {
                path: '/workbench/settings',
                name:'settings',
                component: () => import('../views/settings/Settings.vue')
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
