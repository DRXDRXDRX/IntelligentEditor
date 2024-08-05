import { RouteRecordRaw, createRouter, createWebHistory, type RouteRecord, RouteLocationNormalized, NavigationGuardNext  } from "vue-router";
import { ElMessage } from "element-plus";
import http from '@/utils/request';

// createRouter 创建路由实例，===> new VueRouter()
// history 是路由模式，hash模式，history模式
// createWebHistory() 是开启history模块 
// createWebHashHistory() 是开启hash模式   

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/HomePage.vue'),
    },
    {
        path: '/edit',
        name: 'Edit',
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
            http.request({
                url: '/user/me',
                method: 'get',
                }).then((res) => {
                    console.log(res.code);
                    console.log(to.path);
                    
                    if(to.path === '/edit' && res.code !== 401) {
                        next();
                        
                    } else {
                        ElMessage.error('请先登录');
                        next('/login');
                    }
                }).catch((err) => {
                    console.log(err);
                    ElMessage.error('请求失败');
                    next('/login');
                })
        },
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
        path: '/help',
        name: 'help',
        component: () => import('../views/help.vue')
    },
    {
        path:'/article',
        name:'article',
        component: () => import('../views/article.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue')
    }
    
] as RouteRecordRaw[];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;