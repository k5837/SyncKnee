import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import Login from '@/views/Login'
import Main from '../views/Main.vue'
import store from '../store/index'


Vue.use(Router)
Vue.use(Vuex)


const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Main',
      name: 'Main',
      component: Main,
      children: [
        {
          path: '/Home',
          name: 'Home',
         component: () => import('@/views/Home/Home'),
          // meta: {
          //   requireAuth: true
          // }
        },
        {
          path: '/pattern',
          name: 'pattern',
          component: () => import('@/views/pattern/pattern'),
          // meta: {
          //   requireAuth: true
          // }
        },

      ],
    },
  ]
})


router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (token) { // 通过vuex state获取当前的token是否存在
      next()
    } else {
      console.log('该页面需要登陆')
      next({
        path: '/Login'
        // query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})

export default router