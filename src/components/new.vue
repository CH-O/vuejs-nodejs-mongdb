<template>
	<div class="wrap new" id="new">
      <form id="newForm">
        <input type="text" name="id" class="hidden" v-model="id">
        <div class="form-group">
          <label for="newFormType">Select type</label>
          <select class="form-control" name="type" v-model="type" v-verify.new="type">
            <option v-for="option in selectType" :value="option._id">{{option.name}}</option>
          </select>
          <label v-verified="verifyError.type" class="prompt"></label>
        </div>
        <div class="form-group">
          <label for="newFormTitle">Title</label>
          <input type="text" class="form-control" name="title" placeholder="title" autocomplete="off" v-model="title" v-verify.new="title">
          <label v-verified="verifyError.title" class="prompt"></label>
        </div>
        <div class="form-group">
          <label for="newFormContent">Content</label>
          <textarea class="form-control" name="content" rows="20" style="resize:none;" v-model="content" v-verify.new="content"></textarea>
          <label v-verified="verifyError.content" class="prompt"></label>
<pre>&lt;%span%&gt; &lt;%/span%&gt;
&lt;%h3%&gt; &lt;%/h3%&gt;
&lt;%p%&gt; &lt;%/p%&gt;
&lt;%ul%&gt;
  &lt;%li%&gt; &lt;%/li%&gt;
&lt;%/ul%&gt;
&lt;%pre%&gt; &lt;%/pre%&gt;</pre>
        </div>
        <button type="button" class="btn btn-default" data-loading-text="Loading..." autocomplete="off" @click="newsubmit">Submit</button>
        <button type="reset" class="btn btn-default">reset</button>
        <button type="button" class="btn btn-default" @click="preview">preview</button>
      </form>
      <div class="preview" v-show="showPreview">
        <h2 class="title">{{title}}</h2>
        <span class="glyphicon glyphicon-remove close" @click="showPreview = false"></span>
        <div id="con" class="view" v-html="html"></div>
      </div>
    </div>
</template>
<script>
export default {
  name:'new',
  data () {
    return {
      id: '',
      type: '',
      title: '',
      content: '',
      selectType:'',
      html: '',
      showPreview:false,
    }
  },
  mounted: function() {
    this.getSelectType()
    this.getEitListId()
  },
  methods:{
    preview: function(){
      this.showPreview = true
      this.html = this.content.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/&lt;%/g,'<').replace(/%&gt;/g,'>')
    },
    newsubmit: function(event){
      if(this.$verify.check('new')){
        var $btn = $(event.target).button('loading')
        this.$http.post('/newArticle',{_id:this.id,classify:this.type,title:this.title,content:this.content}).then(function(response){
          this.id = ''
          this.type = ''
          this.title = ''
          this.content = ''
          $('#new').prepend('<div class="alert alert-success" id="resultInfoSuccess" role="alert">操作成功！</div>')
          $btn.button('reset')
          setTimeout(function(){
            $('#resultInfoSuccess').alert('close')
          }, 2000);
        },function(response){
          $('#new').prepend('<div class="alert alert-warning" id="resultInfoFail" role="alert">操作失败！</div>')
          $btn.button('reset')
          setTimeout(function(){
            $('#resultInfoFail').alert('close')
          }, 2000);
        })
      }
    },
    getSelectType: function(){
      this.$http.get('/classify').then(function(response){
        this.selectType = response.body
      },function(response){
          $('#new').prepend('<div class="alert alert-warning" role="alert">操作失败！</div>')
      })
    },
    getEitListId:function(){
      if(this.$route.params.id != undefined){
        this.id = this.$route.params.id
        this.$http.get('/editArticle/'+this.id).then(function(response){
          this.title = response.body.title
          this.content = response.body.content
          this.type = response.body.classify
        },function(response){
          $('#new').prepend('<div class="alert alert-warning" role="alert">操作失败！</div>')
        })
      }

      
    }
     

  },
  verify:{
    type: "required",
    title: "required",
    content: "required"
  },
  computed:{
    verifyError:function(){
      return this.$verify.$errors
    }
  }

}
</script>
<style scoped>
.preview{
  position: absolute;
  top: 0;
  width:900px; 
  background-color: #fff;
}
.close{
  position: absolute;
  right: 20px;
  top: 10px;
}
</style>
