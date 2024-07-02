import { RouteRecordRaw, createRouter, createWebHistory, type RouteRecord  } from "vue-router";

// createRouter 创建路由实例，===> new VueRouter()
// history 是路由模式，hash模式，history模式
// createWebHistory() 是开启history模块 
// createWebHashHistory() 是开启hash模式   

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomePage.vue'),
    },
    {
        path: '/edit',
        name: 'Edit',
        component: () => import('../views/Edit.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/login/Register.vue')
    },
    {
        path: '/reset',
        name: 'ResetPassword',
        component: () => import('../views/login/ResetPassword.vue')
    },
    {
        path: '/demo',
        name: 'demo',
        component: () => import('../views/demo.vue')
    },
    {
        path: '/toolbox',
        name: 'toolbox',
        component: () => import('../views/Toolbox.vue')
    }
] as RouteRecordRaw[];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;