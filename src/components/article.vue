<template>
	<div class="wrap" v-show="!!getArticle">
	    <h2 class="title">{{itemTitle}}</h2>
	    <span class="text-primary">{{itemclassify.name}}</span>
	    <div  class="text-info bg-success">
	       {{itemupdateAt | date}}
	    </div>
	    <div class="view" v-html="itemHtml">
	    </div>
	    <div class="commentForm">
	      <a href="" class="userImg">
	        <img src="../assets/image/user.jpg" alt="...">
	      </a>
	      <div class="textarea">
	        <textarea class="form-control" rows="5" v-model="commentval"></textarea>
	        <span class="maxVal">{{commentValLength}}/300</span>
	      </div>

	      <div class="commentBtn">
	        <button type="button" class="btn btn-success" @click="userComment">发表评论</button>
	      </div>
	    </div>
	    <div class="commentList">
	      <ul class="media-list" @click="submitReply">
	        <li class="media" v-for="comment in ArticleComment">
	          <a class="pull-left" href="#">
	              <img class="media-object" src="../assets/image/user.jpg" :alt="comment.from.username">
	            </a>
	            <div class="media-body">
	              <h4 class="media-heading text-primary">{{comment.from.username}}</h4>
	              <span class="text-info bg-success">{{comment.createAt | date}}</span>
	              <pre>{{comment.content}}</pre>
	              <span class="text-info pull-right"  style="font-size:14px; margin-left:18px;" @click="reply(comment._id,comment.from._id,$event)">回复</span>
	              <div class="media" v-for="commentreply in comment.reply" v-if="(replyIsShow == comment._id)">
	                <a class="pull-left" href="#">
	                  <img class="media-object" src="../assets/image/user.jpg" :alt="commentreply.from.username">
	                </a>
	                <div class="media-body">
	                  <h4 class="media-heading text-primary">{{commentreply.from.username}}</h4>
	                  <p class="text-warning"><span class="text-info bg-success">{{commentreply.createAt | date}}</span>回复: {{commentreply.to.username}}</p>
	                  <pre>{{commentreply.content}}</pre>
	                  <span class="text-info pull-right" style="font-size:14px; margin-left:18px;" @click="reply(comment._id,commentreply.from._id,$event)">回复</span>
	                </div>
	              </div> 
	            <span @click="replyIsShow = comment._id" v-show="!(replyIsShow == comment._id) && (comment.reply.length > 0)">查看更多回复</span>
	            <span @click="replyIsShow = ''" v-show="(replyIsShow == comment._id)">收起更多回复</span>
	            </div>
	        </li>
	      </ul>
	      <nav aria-label="Page navigation" v-if="commentCount && (commentCount != 1) ">
	        <ul class="pagination">
	          <li :class="{disabled : commentPage == 1}">
	            <a :href="'/comment/reply/'+(commentPage<=1?commentPage:commentPage-1)" aria-label="Previous" @click.prevent="commentPage<=1?commentPage=1:commentPage--">
	              <span aria-hidden="true">&laquo;</span>
	            </a>
	          </li>
	          <li v-for="num in commentCount" :class="{active : commentPage == num}"><a :href="'/comment/reply/'+num" @click.prevent="commentPage=num">{{num}}</a></li>
	          <li :class="{disabled : commentPage == commentCount}">
	            <a :href="'/comment/reply/'+(commentPage>=commentCount?commentPage:commentPage+1)" aria-label="Next" @click.prevent="commentPage>=commentCount?commentPage=commentCount:commentPage++">
	              <span aria-hidden="true">&raquo;</span>
	            </a>
	          </li>
	        </ul>
	      </nav>
	      <p class="bg-primary" v-show="!commentCount && (commentCount == 0)" style="padding:10px 0 10px 20px">暂没有评论！</p>
	    </div>
	</div>
</template>
<script type="text/javascript">
	export default {
		name:'Article',
		props: ['userInfo','getArticleId'],
		data () {
			return {
				itemTitle: '',
				itemupdateAt: '',
				itemHtml: '',
				itemclassify: '',
				commentval: '', 
				ArticleComment: '',
				replyIsShow: '',
				commentCount: '',
				commentPage: 1,
				commentValLength: 0,
				routeId:'',
			}
		},
		mounted: function () {

			if(this.$route.params.id == undefined){
				this.getLatestInsert()
			}else{
				this.getCommentReply()
				this.getArticle()
				this.getCommentCount()
			}
		},
		methods:{
			getLatestInsert: function() {
		    	this.$http.get('/newestArticle').then(function(response){
		    		this.$emit('update:getArticleId',response.body.article._id)
			        this.itemclassify = response.body.article.classify
			        this.itemTitle = response.body.article.title
			        this.itemupdateAt = response.body.article.meta.updateAt
			        this.itemHtml = response.body.article.content.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/&lt;%/g,'<').replace(/%&gt;/g,'>')
			        this.ArticleComment = response.body.comment
			        this.commentCount = parseInt(Math.ceil(response.body.commentCount/10))
				},function(response){})
		    },  
		    getArticle: function(){
		      this.$http.get('/Article/'+this.$route.params.id).then(function(response){
		        $(".page-subject").scrollTop(0)
		        this.$emit('update:getArticleId',response.body.article._id)
		        this.itemclassify = response.body.article.classify
		        this.itemTitle = response.body.article.title
		        this.itemupdateAt = response.body.article.meta.updateAt
		        this.itemHtml = response.body.article.content.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/&lt;%/g,'<').replace(/%&gt;/g,'>')
		      },function(response){

		      })
		    },
		   
		    userComment: function(event){
		      var obj = $(event.target).parent()
		      if(!!this.userInfo){
		          var comment = {}
		        comment.article = this.getArticleId
		        comment.content = this.commentval
		        var obj = $(event.target).parent()
		        if(this.commentval == ''){
		          obj.after(`<div class="alert alert-warning" id="userComment" role="alert">评论不能为空！</div>`)
		            setTimeout(function(){
		              $('#userComment').alert('close')
		          },3000);
		            return
		        }else if(this.commentValLength > 300){
		          obj.after(`<div class="alert alert-warning" id="userComment" role="alert">字数长度不能超过300！</div>`)
		            setTimeout(function(){
		              $('#userComment').alert('close')
		          },3000);
		            return
		        }
		        this.$http.post('/comment',comment).then(function(response){
		          if(response.body.success == 0){        
		            obj.after(`<div class="alert alert-warning" id="userComment" role="alert">请先登录！<a href="#" data-toggle="modal" data-target="#login-box">登录</a></div>`)
		            setTimeout(function(){
		              $('#userComment').alert('close')
		            }, 3000); 
		            return        
		          }
		          this.commentval = ''
		          this.getCommentReply()
		          this.getCommentCount()
		        },function(response){})
		      }else{
		        obj.after(`<div class="alert alert-warning" id="userComment" role="alert">请先登录！<a href="#" data-toggle="modal" data-target="#login-box">登录</a></div>`)
		        setTimeout(function(){
		          $('#userComment').alert('close')
		        }, 3000); 
		      } 
		    },
		    reply: function(cid,tid,event){
		      var obj = $(event.target)
		      $('#replyBox').alert('close')
		      var code = `<div class="alert" id="replyBox" role="alert" >
		                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
		                      <span aria-hidden="true">&times;</span>
		                    </button>
		                    <textarea class="form-control" rows="3" style="resize:none;" id="replyVal"></textarea>
		                    <button type="button" class="btn btn-primary pull-right" data-tid="`+tid+`" data-cid="`+cid+`" data-reply="yes" style="margin-top:5px;">回复</button>
		                  </div>`          
		      obj.after(code)
		    },
		    submitReply:function(event){
		      if($(event.target).data('reply') == 'yes'){
		        var obj = $(event.target).parent()
		        if(!!this.userInfo){
		          var tid = $(event.target).data('tid')
		          var cid = $(event.target).data('cid')
		          var content = $('#replyVal').val()
		          if(content.length > 300){
		          	obj.after(`<div class="alert alert-warning" id="userComment" role="alert">字数长度不能超过300！</div>`)
		            setTimeout(function(){
		              $('#userComment').alert('close')
		          },3000);
		          	return
		          }
		          this.$http.post('/reply',{cid:cid,tid:tid,content:content}).then(function(response){
		            if(response.body.success == 0){    
		                  
		              obj.after(`<div class="alert alert-warning" id="userComment" role="alert">请先登录！<a href="#" data-toggle="modal" data-target="#login-box">登录</a></div>`)
		              setTimeout(function(){
		                $('#userComment').alert('close')
		              }, 3000); 
		              return        
		            }
		            $('#replyBox').alert('close')
		            this.getCommentReply()
		            this.getCommentCount()
		          },function(response){})
		        }else{
		          obj.after(`<div class="alert alert-warning" id="userComment" role="alert">请先登录！<a href="#" data-toggle="modal" data-target="#login-box">登录</a></div>`)
		          setTimeout(function(){
		            $('#userComment').alert('close')
		          }, 3000);
		        }
		      }
		    },
		    getCommentReply: function(){
		      this.$http.get('/getComment?aid='+this.$route.params.id+'&page='+this.commentPage).then(function(response){
		        this.ArticleComment = response.body
		      },function(response){})
		    },
		    getCommentCount: function(){
		      this.$http.get('/commentCount/'+this.$route.params.id).then(function(response){
		        this.commentCount =  parseInt(Math.ceil(response.body/10))
		      },function(response){})
		    }
		},
		watch: {
			'$route.params.id': function(){
				if(this.$route.params.id != undefined){
					if(this.commentPage == 1){
				        this.getCommentReply()
				    }else{
				        this.commentPage = 1
				    }
				    this.getArticle()
				    this.getCommentCount()
				}else{
					this.getLatestInsert()
				}	
			},
		    commentPage:function(){
		      this.getCommentReply()
		    },
		    commentval:function(){
		      this.commentValLength = this.commentval.length	
			}
		},
		filters: {
		    date:function (input) {
		        var d = new Date(input);
		        var year = d.getFullYear();
		        var month = d.getMonth() + 1;
		        var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
		        var hour = d.getHours();
		        var minutes = d.getMinutes();
		        var seconds = d.getSeconds();
		        return year+ '/' + month +  '/' + day + ' ' + hour + ':' + minutes + ':' + seconds;
		    }
		}
	}
</script>
<style type="text/css" scoped>
	.commentForm{
  margin-bottom: 30px;
  border-bottom: 1px solid #999;
}
.commentForm .userImg{
  margin:0 20px;
  display: inline-block;
  float: left;
}
.commentForm .userImg img, .commentList img{
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.textarea{
  position: relative;
  width: 750px;
  float: left;
  
}
.maxVal{
  position: absolute;
  right: 8px;
  bottom: 5px;
  color: #999;
}
.textarea textarea{
  resize:none;
  overflow: auto;
}
.commentBtn{
  padding-top: 125px;
  padding-bottom: 10px;
  height:180px;
}
.commentBtn button{
  float: right;
  margin-right: 70px;
}
.commentList{
  padding: 40px 20px;
}
.commentList pre{
  white-space: pre-wrap;
  word-wrap: break-word;
}
.commentList span{
  cursor:pointer;
}

</style>