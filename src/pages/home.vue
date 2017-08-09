<template>
  <div class="content-box">
    <div class="center">
      <aside class="page-side">
        <nav class="page-side-box">
          <ul class="panel-group" id="MyAccordion">
            <li class="panel panel-default" v-for="type in navLink">
              <div class="panel-heading" data-toggle="collapse" :data-target="'#'+type.id"
              data-parent="#MyAccordion">
                <h4 class="panel-title">{{type.name}}</h4>
              </div>
              <div class="panel-collapse collapse" :id="type.id">
                <div class="panel-body">
                  <ul>
                    <li v-for="item in type.child"><router-link :to="'/index/article/'+item.id" :class="{active : getArticleId ==item.id}" >{{item.title}}</router-link></li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </aside>
      <section class="page-subject">
          <router-view :user-info="userInfo" :get-article-id="getArticleId" @update:getArticleId="val => getArticleId = val"></router-view>
      </section>  
    </div>
    
  </div>
 
</template>

<script>
export default {
  name: 'Home',
  props: ['userInfo','allArticles'],
  data () {
    return {
      navLink: '',
      getArticleId: ''
    }
  },
  mounted: function () {
    this.listLink()
  },
  methods: {
    listLink:function(){
      var navLink = []
      this.$http.get('/classify').then(function(response){
        this.$http.get('/allArticle').then(function(allArticle){
          this.$emit('update:allArticles', allArticle.body)
            for(var i=0;i<response.body.length;i++){
              var child = []
              for(var j=0;j<allArticle.body.length;j++){
                if(allArticle.body[j].classify == response.body[i]._id){
                  child.push({title: allArticle.body[j].title,
                    id: allArticle.body[j]._id
                  })
                }
              }
              navLink.push({name: response.body[i].name,
                            id: response.body[i]._id,
                            child: child})
            }
           this.navLink = navLink
        },function(response){})
      },function(response){})
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page-side .panel-body a{
  display: block;
}
.page-side .panel-title,.page-side .panel-body a{
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis  
}
.panel-group{
  padding: 0;
}
.panel-heading{
  background-color: transparent;
}
.panel{
   border:none;
   box-shadow: none;
}
.panel-body{
  padding:5px 20px;
}
.panel-body ul{
  padding-left:10px;
}
.panel-body a:hover{
  color: #5FB878;
  font-size: 15px;
}
.active{
  color: #5FB878;
  font-size: 15px;
}

</style>
