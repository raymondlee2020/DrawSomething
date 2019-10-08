import Vue from 'vue'
import Router from 'vue-router'
import LoginBlock from '@/components/LoginBlock'
import WaitBlock from '@/components/WaitBlock'
import GameBlock from '@/components/GameBlock'

Vue.use(Router);

const router = new Router({
    mode: "history",
    routes: [
        {
            path: '',
            redirect: '/login'
        },
        {
            path: '/login',
            component: LoginBlock
        },
        {
            path: '/wait',
            component: WaitBlock
        },
        {
            path: '/game',
            component: GameBlock
        }
    ]
})

export default router;