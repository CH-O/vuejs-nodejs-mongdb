// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './verify'
import 'assets/css/bootstrap.min.css' 
import 'assets/css/style.css' 
import 'assets/js/bootstrap.min'
import Resource from 'vue-resource'
Vue.use(Resource)

Vue.config.productionTip = false

var vm = new Vue()

router.beforeEach((to, from, next) => {
	if (to.meta.requireAuth) {
	    vm.$http.get('/isAdmin').then(function(response){
	        if(response.body.success > 10){
            	next()
	        }
	        next(false)
	    },function(response){
	    	next(false)
	    })     
    }else {
       next(); 
    }
    
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})