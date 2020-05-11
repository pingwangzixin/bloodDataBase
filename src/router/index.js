import Vue from 'vue'
import Router from 'vue-router'
import navBar from '@/components/navBar.vue'
import Login from '@/views/login'
import user from '@/views/user'
const jwt = require('jsonwebtoken')
Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      name: '导航',
      component: navBar,
      children: [
        {
          path: 'index',
          component: user,
          name: '患者管理',
          meta: {
            requireAuth: true
          }
        },

      ],
      meta: {
        requireAuth: true
      },
      redirect: '/index'
    },
    {
      path: '/login',
      name: '登陆',
      component: Login,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/*',
      redirect: '/index'
    }
  ]
})

export default router
