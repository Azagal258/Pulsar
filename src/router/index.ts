import { createWebHistory, createRouter } from 'vue-router'

import BaseLayout from '../layouts/BaseLayout.vue'

import HomePage from '../pages/HomePage.vue'
import UserObjektsPage from '../pages/UserObjektsPage.vue'
import UserTradesPage from '../pages/UserTradesPage.vue'
import TestPage from '../pages/TestPage.vue'
import UserLayout from '../layouts/UserLayout.vue'
import ObjektInfo from '../pages/ObjektInfo.vue'

const routes = [
    {
        path: '/',
        component: BaseLayout,
        children: [
            { 
                path: '', 
                component: HomePage 
            },
            {
                path: 'user/:address',
                component: UserLayout,
                props: true,
                children: [
                    {
                        path: '',
                        component: UserObjektsPage,
                        props: true,
                    },
                    {
                        path: 'trades',
                        component: UserTradesPage,
                        props: true
                    },
                ]
            },
            {
                path: 'about',
                component: TestPage
            },
        ]
    },
    {
        path: '/info/:content',
        component: ObjektInfo
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})