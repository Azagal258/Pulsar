import { createWebHistory, createRouter } from 'vue-router'

import MainPage from '../components/MainPage.vue'
import TestPage from '../components/TestPage.vue'
import UserPage from '../components/UserPage.vue'

const routes = [
    { path: '/', component: MainPage },
    { path: '/about', component: TestPage },
    { path: '/user/:address', name: 'user', component: UserPage , props: true }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router