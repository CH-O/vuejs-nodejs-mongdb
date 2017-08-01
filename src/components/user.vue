<template>
	<div class="wrap">
	    <table class="table"  @click="deleteUser($event)">
	    	<colgroup>
	          	<col width="150">
	          	<col width="200">
	          	<col width="200">
	          	<col width="100">
	        </colgroup>
	    	<thead>
	          	<tr>
	            	<th>用户名</th>
	           		<th>创建时间</th>
	            	<th>登录时间</th>
	            	<th>权限</th>
	            	<th>编辑</th>
				</tr>
	        </thead>
	        <tbody>
	        	<tr v-for="user in userlist">
	        		<td>{{user.username}}</td>
	        		<td>{{user.meta.createAt | date}}</td>
	        		<td>{{user.meta.updateAt | date}}</td>
	        		<td>{{user.role}}</td>
	        		<td>
						<button type="button" class="btn btn-danger" @click="deleteUserBox(user.username,$event,user._id)">删除</button>
					</td>
	        	</tr>
	        </tbody>
		</table>
	    <nav aria-label="Page navigation" v-show="userCount">
	        <ul class="pagination">
            <li :class="{disabled : page == 1}">
              <a :href="'/admin/user/'+(page<=1?page:page-1)" aria-label="Previous" @click.prevent="page<=1?page=1:page--">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li v-for="num in userCount" :class="{active : page == num}"><a :href="'/admin/user/'+num" @click.prevent="page=num">{{num}}</a></li>
            <li :class="{disabled : page == userCount}">
              <a :href="'/admin/user/'+(page>=userCount?page:page+1)" aria-label="Next" @click.prevent="page>=userCount?page=userCount:page++">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
	        </ul>
      </nav>
	</div>
</template>
<script type="text/javascript">
export default {
  data () {
    return {
    	userCount: '',
    	userlist: '',
    	page: 1
    }
  },
  mounted: function () {
    this.getUserCount()
    this.getuserList()
  },
  methods: {
  	getUserCount: function(){
  		this.$http.get('/userCount').then(function(response){
  			this.userCount = parseInt(Math.ceil(response.body/10))
  		},function(response){

  		})
  	},
  	deleteUserBox: function(title,event,id) {
      var obj = $(event.target)
      $('#delUserInfo').alert('close')
      while(obj.prop("tagName") != 'TR' && obj.prop("tagName") != 'BODY'){
        obj = obj.parent()
      }
      var code = `<tr>
                    <td class="alert alert-warning" id="delUserInfo" role="alert" colspan='5'>
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      Do you really want to delete "`+ title+`" ?
                      <button type="button" class="btn btn-danger" data-del="yes" data-id="`+id+`">Yes</button>
                    </td>
                  </tr>`
      obj.before(code)
    },
    deleteUser:function(event) {
      if($(event.target).data('del') == 'yes'){
        var id = $(event.target).data('id')
        this.$http.get('/delUser/'+id).then(function(response){
        	$('#delUserInfo').alert('close')
        	this.getUserCount()
    		this.getuserList()
    	},function(response){

    	})
        
      }
    },
  	getuserList: function() {
      var page = this.page.toString()
      this.$http.get('/userList/'+page).then(function(response){
        this.userlist = response.body
      },function(response){
        $('#listContent').prepend(`<tr><td colspan='4' class="alert alert-warning" id="getTypeListFail" role="alert">操作失败！</td></tr>`)
        setTimeout(function(){
          $('#getTypeListFail').alert('close')
        }, 2000);
      })
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
        return year+ '-' + month + '-' + day + '  ' + hour + ':' + minutes + ':' + seconds;
    }
  },
  watch: {
    page:function(){
      this.getuserList()
    }
  }
}
  
</script>
<style type="text/css">
.delete-type{
    position: absolute;
    top: 0;
    right:5px;
    font-size:12px;
    line-height: 20px;
    z-index: 101;
    cursor: pointer;
}
.edit-type-input{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
