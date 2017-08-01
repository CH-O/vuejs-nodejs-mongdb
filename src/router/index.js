import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home'
import Admin from '@/pages/admin'
import Edit from '@/components/edit'
import New from '@/components/new'
import User from '@/components/user'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: {
        requireAuth: false, 
      },
      component: Home
    },
    {
      path: '/admin',
      name: 'Admin',
      meta: {
        requireAuth: true, 
      },
      component: Admin,

      children:[
        {
          path:'/admin/edit',
          name: 'Edit',
          meta: {
            requireAuth: true, 
          },
          component:Edit
        },
        {
          path:'/admin/new',
          name: 'New',
          meta: {
            requireAuth: true, 
          },
          component:New
        },
        {
          path:'/admin/edit/:id',
          name:'EditItem',
          meta: {
            requireAuth: true, 
          },
          component:New
        },
        {
          path:'/admin/user',
          name:'User',
          meta: {
            requireAuth: true, 
          },
          component:User
        }
      ]
    }
  ]
})
