<template>
	<div class="wrap">
    <nav>
      <ul  class="nav nav-tabs">
        <div class="btn-group" role="group" aria-label="...">
          <button type="button" class="btn btn-default" data-toggle="modal" data-target="#addType-box"><span class="glyphicon glyphicon-plus"></span></button>
          <button type="button" id="edit-type-show" v-show="editShow" @click="editShow=!editShow" class="btn btn-default"><span class="glyphicon glyphicon-pencil"></span></button>
          <button type="button" id="edit-btn-show" v-show="!editShow" @click="editShow=!editShow" class="btn btn-default"><span class="glyphicon glyphicon-ok"></span></button>
        </div>
        <li role="presentation" v-for="type in types" :class="{active : typeId == type._id}">
          <a href="javascript:;" @click.prevent="typeId = type._id,typeName = type.type">{{type.name}}</a>
          <input type="text" name="type" v-show="!editShow" autocomplete="off" class="edit-type-input" v-model="type.name" @change="updateType(type._id,type.name)">
          <span class="glyphicon glyphicon-remove delete-type" v-show="!editShow" data-toggle="modal" data-target="#delType-box" @click="deleteTypeId = type._id"></span>
        </li>
      </ul>      
    </nav>
        <!-- 选项卡面板 -->
    <div >
      <table class="table table-bordered"  @click="deleteItem($event)">
        <colgroup>
          <col width="200">
          <col width="200">
          <col width="200">
          <col width="100">
        </colgroup>
        <thead>
          <tr>
            <th>标题</th>
            <th>加入时间</th>
            <th>更新时间</th>
            <th>编辑</th>
          </tr>
        </thead>
        <tbody id="listContent">
          <tr v-for="list in typeList">
            <td>{{list.title}}</td>
            <td>{{list.meta.createAt | date}}</td>
            <td>{{list.meta.updateAt | date}}</td>
            <td>
              <div class="btn-group" role="group" aria-label="edit">
                <router-link :to="'/admin/edit/'+list._id" class="btn btn-default">修改</router-link>
                <button type="button" class="btn btn-default" @click="deleteItemBox(list.title,$event, list._id)">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <nav aria-label="Page navigation" v-show="count">
        <ul class="pagination">
          <li :class="{disabled : page == 1}">
            <a :href="'/admin/edit/'+typeName+'/'+(page<=1?page:page-1)" aria-label="Previous" @click.prevent="page<=1?page=1:page--">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li v-for="num in count" :class="{active : page == num}"><a :href="'/admin/edit/'+typeName+'/'+num" @click.prevent="page=num">{{num}}</a></li>
          <li :class="{disabled : page == count}">
            <a :href="'/admin/edit/'+typeName+'/'+(page>=count?page:page+1)" aria-label="Next" @click.prevent="page>=count?page=count:page++">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
      <!-- 删除类型 -->
      <div class="modal fade" id="delType-box" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="myModalLabel">删除类型</h4>
            </div>
            <div class="modal-body">
              Do you really want to delete and all relevant information?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="deleteType">Delete</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 添加类型 -->
      <div class="modal fade" id="addType-box" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="myModalLabel">添加类型</h4>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="addTypeInput">AddType</label>
                  <input type="text" name="type" placeholder="请输入" autocomplete="off" class="form-control" v-model="addTypeVal" v-verify.addclassify="addTypeVal">
                  <label v-verified="verifyError.addTypeVal" class="prompt"></label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="addType">Save</button>
            </div>
          </div>
        </div>
      </div> 
    </div>
</template>
<script type="text/javascript">
export default {
  data () {
    return {
      web: '',
      types: [],
      typeId: '',
      typeName: '',
      typeList: '',
      count: '',
      page: '',
      editShow: true,
      deleteTypeId:'',
      addTypeVal: ''
    }
  },
  mounted: function () {
    this.classify()
  },
  methods: {
    classify: function(){
      this.$http.get('/classify').then(function(response){
        this.types = response.body
      },function(response){

      })
    },
    getTypeCount: function() {
      this.$http.get('/articleCount/'+this.typeId).then(function(response){  
        this.page = 1        
        this.count = parseInt(Math.ceil(response.body/10))
        console.log(this.count)
      },function(response){
        $('#listContent').prepend(`<tr><td colspan='4' class="alert alert-warning" id="getTypeCountFail" role="alert">操作失败！</td></tr>`)
        setTimeout(function(){
          $('#getTypeCountFail').alert('close')
        }, 2000);
      })
    },
    getTypeList: function() {
      var page = this.page.toString()
      this.$http.get('/articleList?classify='+this.typeId+'&page='+page).then(function(response){
        this.typeList = response.body
      },function(response){
        $('#listContent').prepend(`<tr><td colspan='4' class="alert alert-warning" id="getTypeListFail" role="alert">操作失败！</td></tr>`)
        setTimeout(function(){
          $('#getTypeListFail').alert('close')
        }, 2000);
      })
    },
    deleteType:function() {
      $('#delType-box').modal('hide')
      this.$http.delete('/delClassify/'+this.deleteTypeId).then(function(response){
        this.types = this.types.filter(t => t._id != this.deleteTypeId)
      },function(response){})
    },
    addType: function() {
      if(this.$verify.check('addclassify')){
        console.log(this.addTypeVal)
        this.$http.post('/addClassify',{'name':this.addTypeVal}).then(function(response){
          this.addTypeVal = ""
          this.types.push(response.body)
          $('#addType-box').modal('hide')
        },function(response){})    
      }
      return
    },
    updateType: function(id,type) {
      this.$http.post('/addClassify',{_id:id,name:type}).then(function(response){},function(response){})
    },
    deleteItemBox: function(title,event,id) {
      var obj = $(event.target)
      $('#delListInfo').alert('close')
      while(obj.prop("tagName") != 'TR' && obj.prop("tagName") != 'BODY'){
        obj = obj.parent()
      }
      var code = `<tr>
                    <td class="alert alert-warning" id="delListInfo" role="alert" colspan='4'>
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      Do you really want to delete "`+ title+`" ?
                      <button type="button" class="btn btn-danger" data-del="yes" data-id="`+id+`">Yes</button>
                    </td>
                  </tr>`
      obj.before(code)
    },
    deleteItem:function(event) {
      if($(event.target).data('del') == 'yes'){
        var id = $(event.target).data('id')
        this.$http.delete('/delArticle/'+id).then(function(response){
          $('#delListInfo').alert('close')
          this.getTypeList()
          this.getTypeCount()
        },function(response){

        })
      }
    }

  },
   verify:{
    addTypeVal: "required",
  },
  computed:{
    verifyError:function(){
      return this.$verify.$errors
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
      this.getTypeList()
    },
    typeId:function(){
      this.getTypeCount()
      if(this.page == 1){
        this.getTypeList()
      }else{
        this.page = 1
      } 
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