<template>
  <div id="app" @click="searchShow = false">
    <header class="navbar navbar-static-top" id="page-head">
      <div class="container">
        <div class="navbar-header">
          <router-link class="navbar-brand" to="/index"><img src="./assets/image/logo.png"></router-link>
        </div>
        <nav class="navbar-inverse">
          <ul class="nav navbar-nav navbar-right">
            <li v-show="!userInfo"><a href="#" data-toggle="modal" data-target="#login-box"><span class="glyphicon glyphicon-user" aria-hidden="true" ></span> 登录</a></li>
            <li class="user" v-show="!!userInfo">
              <a href="#" ><img src="./assets/image/user.jpg" class="userImg"></a>
              <div class="userMenu">
                <div class="userinfo">
                  <a href="#"><img src="./assets/image/user.jpg"></a>
                  <span class="userName" >{{userInfo.username}}</span>
                </div>
                <ul class="userList">
                  <li v-if="userInfo.role > 0">
                    <router-link to="/admin"><span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span> 后台</router-link>
                  </li>
                </ul>
                <div class="signOut">
                  <span>
                    <a href="#" id="modifyPassword" data-toggle="modal" data-target="#modifyPassword-box">修改密码</a>
                    <a href="#" id="signOut" @click.prevent="userLogout">退出登录</a>
                  </span>
                </div>
              </div>
            </li>
          </ul>
          <div class="search">
            <input type="text" name="" class="search-input" placeholder="搜索" v-model="searchVal" @click.stop="searchShow = true">
            <ul class="search-list" v-show="searchShow">
              <li v-for="article in searchList"><router-link :to="'/index/article/'+article._id" @click.native="inSearch(article.title)">{{article.title}}</router-link></li>
              <li v-show="searchVal.length > 0 && searchList.length == 0">查找不到相关内容！</li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
    <router-view :user-info="userInfo" :all-articles="allArticles" @update:allArticles="val => allArticles = val"></router-view>

    <div class="modal fade" id="login-box" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <ul  class="nav nav-tabs modal-title" role="tablist" id="myModalLabel">
              <li class="active">
                <a href="#login-form" role="tab" data-toggle="tab">登录</a>
              </li>
              <li>
                <a href="#reg-form" role="tab" data-toggle="tab">注册</a>
              </li>
            </ul>
          </div>
          <div class="modal-body">
            <!-- 登录框 -->
            <div id="myTabContent" class="tab-content">
              <div class="tab-pane fade in active " id="login-form">  
                <form>
                  <div class="form-group">
                    <label for="loginInputLoginUsername">用户名</label>
                    <input type="text" class="form-control" id="loginInputLoginUsername" autocomplete="off" v-verify.log="loginName" v-model="loginName">
                    <label v-verified="verifyError.loginName" class="prompt"></label>
                  </div>
                  <div class="form-group">
                    <label for="loginInputPassword1">密码</label>
                    <input type="password" class="form-control" id="loginInputPassword1" autocomplete="off" v-verify.log="loginPass" v-model="loginPass">
                    <label v-verified="verifyError.loginPass" class="prompt"></label>
                  </div>
                </form>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                  <button type="button" class="btn btn-primary" @click="login">登录</button>
                </div>
              </div><!-- 登录框 end-->
              <!-- 注册框 -->
              <div class="tab-pane fade" id="reg-form">
                <form>
                  <div class="form-group">
                    <label for="registerInputregUsername">用户名</label>
                    <input type="text" class="form-control" id="registerInputregUsername" autocomplete="off" v-verify.regname="registerName" v-model="registerName" @change="userIsExistence">
                    <label class="prompt" v-verified="verifyError.registerName"></label>
                    <label class="prompt" v-show="userExistence">用户名已存在</label>
                  </div>
                  <div class="form-group">
                    <label for="registerInputregPassword">密码</label>
                    <input type="password" class="form-control" id="registerInputregPassword" autocomplete="off" v-verify.reg="registerPass" v-model="registerPass">
                    <label v-verified="verifyError.registerPass" class="prompt"></label>
                  </div>
                  <div class="form-group">
                    <label for="registerInputregPassword2">重复密码</label>
                    <input type="password" class="form-control" id="registerInputregPassword2" autocomplete="off" v-verify.reg="registerPass2" v-model="registerPass2">
                    <label v-verified="verifyError.registerPass2" class="prompt"></label>
                  </div>
                </form>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                  <button type="button" class="btn btn-primary" @click="register">注册</button>
                </div>
              </div> <!-- 注册框 end-->
            </div>
          </div>
        </div>
      </div>
    </div>
 	<!-- 修改密码 -->
    <div class="modal fade" id="modifyPassword-box" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">修改密码</h4>
          </div>
          <div class="modal-body">
             <form id="rePass-form">
              <div class="form-group">
                <label for="exampleInputresetPassword"></label>
                <input type="password" name="password" id="exampleInputresetPassword" placeholder="请输入原密码" autocomplete="off" class="form-control" v-model="rePass">
              </div>
              <div class="form-group">
                <label for="exampleInputresetPassword2"></label>
                <input type="password" name="password2" id="exampleInputresetPassword2" placeholder="请输入新密码" v-verify.rePass="rePass2" autocomplete="off" class="form-control" v-model="rePass2">
                <label v-verified="verifyError.rePass2" class="prompt"></label>
              </div>
              <div class="form-group">
                <label for="exampleInputresetPassword3"></label>
                <input type="password" name="password3" id="exampleInputresetPassword3"  placeholder="请重新输入密码" v-verify.rePass="rePass3" autocomplete="off" class="form-control" v-model="rePass3">
                <label v-verified="verifyError.rePass3" class="prompt"></label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="rePassword">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      loginName: ' ',
      loginPass: '',
      registerName: '',
      registerPass: '',
      registerPass2: '',
      userExistence: false,
      userInfo: '',
      rePass: '',
      rePass2: '',
      rePass3: '',
      allArticles: '',
      searchVal: '',
      searchTime: '',
      searchList: '',
      searchShow: false
    }
  },
  mounted:function(){
    this.loginName = ''
    this.userSession()
  },
  methods:{
    inSearch:function(val){
      this.searchVal = val
      this.searchShow = false
    },
  	userIsExistence:function(){
      if(this.$verify.check('regname')){
        this.$http.post('/userIsExistence',{username:this.registerName}).then(function(response){
        	this.userExistence = !!response.body
        },function(response){})
      }
    },
    register: function() {
      if(this.$verify.check('reg') && !this.userExistence){
        var $btn = $(event.target).button('loading')
        this.$http.post('/register',{username:this.registerName,password:this.registerPass}).then(function(response){
        	$btn.button('reset')
			this.registerName = ''
			this.registerPass = ''
			this.registerPass2 = ''
			$('#reg-form').prepend('<div class="alert alert-success" id="registerSuccess" role="alert">注册成功！请登录</div>')
			setTimeout(function(){
				$('#registerSuccess').alert('close')
			}, 2000);
        },function(response){})
      }
    },
    login: function() {
      if(this.$verify.check('log')){
        var $btn = $(event.target).button('loading')
        this.$http.post('/login',{username:this.loginName,password:this.loginPass}).then(function(response){
          $btn.button('reset')
          if(!response.body){
            $('#login-form').prepend('<div class="alert alert-danger" id="loginFail" role="alert">用户名或密码不正确！</div>')
            setTimeout(function(){
              $('#loginFail').alert('close')
            }, 2000);
          }else{
            this.loginName = ''
            this.loginPass = ''
            $('#login-box').modal('hide')
            this.userInfo = response.body
          }
        },function(response){})
      }
    },
    userSession: function(){
      this.$http.get('/userSession').then(function(response){
      	this.userInfo = response.body
      },function(response){})
    },
    userLogout: function(){
      this.$http.get('/logout').then(function(response){
        if(response.body.success == 1)this.userInfo = ''
      },function(response){})
    },
    rePassword: function(){
    	if(this.$verify.check('rePass')){
	    	this.$http.post('/rePassword',{oldPass:this.rePass,newPass:this.rePass2}).then(function(response){
	    		if(!response.body){
	    			$('#rePass-form').prepend('<div class="alert alert-danger" id="loginFail" role="alert">密码不正确！</div>')
		            setTimeout(function(){
		              $('#loginFail').alert('close')
		            }, 2000);
		            return
	    		}
	    		this.userInfo = ''
	    		this.rePass = ''
				this.rePass2 = ''
				this.rePass3 = ''
	    		$('#rePass-form').prepend('<div class="alert alert-success" id="loginFail" role="alert">修改成功！请重新登录</div>')
		        setTimeout(function(){
		            $('#loginFail').alert('close')
		            $('#modifyPassword-box').modal('hide')
		            $('#login-box').modal('show')
		        }, 1000);
	    	},function(response){})
    	}
    },
    getSearchList: function(){
      var _this = this
      var searchL = []
      clearTimeout(_this.searchTime);
      _this.searchTime = setTimeout(function(){
        
        for(var i=0; i<_this.allArticles.length; i++){
          if(_this.allArticles[i].title.indexOf(_this.searchVal) != -1){
            searchL.push(_this.allArticles[i])
          }
        }
        _this.searchList = searchL
      }, 1000);
    }
  },
  verify:{
    loginName: 'loginName',
    loginPass: 'loginPass',
    registerName: "username",
    registerPass: "password",
    registerPass2: {
        test:function() {
          if (this.registerPass == this.registerPass)return true
          return false
        },
        message:'两次密码不一致'
    },
    rePass2: 'password',
    rePass3: {
        test:function() {
          if (this.rePass2 == this.rePass3)return true
          return false
        },
        message:'两次密码不一致'
    },
  },
  computed:{
    verifyError:function(){
      return this.$verify.$errors
    }
  },
  watch: {
    searchVal: function(){
      this.getSearchList()
    }
  }
}
</script>
<style type="text/css">
.navbar-inverse{
  position: relative;
}
.search {
  position: absolute;
  top: 10px;
  left: 120px;
  width: 200px;
  overflow-x: hidden;
}
.search-input{
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 12px;
    background-color: rgba(255,255,255,.05);
    border: none 0;
    color: #fff;
    font-size: 12px;
    outline: none;
    padding-right: 30px;
    cursor: pointer;
    border-radius: 2px;
}
.search-list{
  background-color: rgba(245,245,245,.7);
  width: 213px;
  padding-left: 20px; 
  max-height: 400px;
  overflow-y: auto;
  z-index: 9999;
}
.search-list li{
  line-height: 36px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.search-list li a{
  text-decoration: none;
  color: #333;  
}
.search-list li a:hover{
  color: #5FB878;
}
</style>