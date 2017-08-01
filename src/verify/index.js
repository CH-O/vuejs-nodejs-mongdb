var myRules={
  loginName:{
    test:/^[\u4E00-\u9FA5A-Za-z0-9_]{2,12}$/,
    message:'用户名不合法'
  },
  loginPass:{
    test:/^[a-zA-Z]\w{5,17}$/,
    message:'密码不合法'
  },
  username:{
    test:/^[\u4E00-\u9FA5A-Za-z0-9_]{2,12}$/,
    message:'2~12位中文、英文、数字包括下划线'
  },
  password:{
    test:/^[a-zA-Z]\w{5,17}$/,
    message:'6~18位字母、数字和下划线以字母开头'
  }

 

}
import Vue from "vue";
import verify from "vue-verify-plugin";
Vue.use(verify,{
  rules:myRules
});
