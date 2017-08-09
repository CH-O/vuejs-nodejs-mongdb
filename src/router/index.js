import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home'
import Admin from '@/pages/admin'
import Edit from '@/components/edit'
import New from '@/components/new'
import User from '@/components/user'
import Article from '@/components/article'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '',
      redirect: { name: 'Article' }
    },
    {
      path: '/index',
      meta: {
        requireAuth: false, 
      },
      component: Home,
      children:[
        {
          path:'article/:id',
          name:'ArticleId',
          meta: {
            requireAuth: false, 
          },
          component:Article
        },
        {
          path:'',
          name:'Article',
          meta: {
            requireAuth: false, 
          },
          component:Article
        }
      ]
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
          path:'edit',
          name: 'Edit',
          meta: {
            requireAuth: true, 
          },
          component:Edit
        },
        {
          path:'new',
          name: 'New',
          meta: {
            requireAuth: true, 
          },
          component:New
        },
        {
          path:'edit/:id',
          name:'EditItem',
          meta: {
            requireAuth: true, 
          },
          component:New
        },
        {
          path:'user',
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
