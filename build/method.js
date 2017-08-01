var Article = require("../schemas/article.js")
var Classify = require("../schemas/classify.js")
var User = require("../schemas/user.js")
var Comment = require("../schemas/comment.js")
var _ = require('underscore')

module.exports={

    //home
    allArticle: function(req,res) {
        Article.find({},{content:0,meta:0}).exec(function(err,result){
            if(err)console.log('allArticle: '+err)
            res.json(result)
        })
    },
    newestArticle: function(req,res){
        Article.findOne({}).sort({'meta.createAt':-1}).populate('classify', 'name').exec(function(err,newestArticle){
            if(!!newestArticle){
                Comment.count({article:newestArticle._id}).exec(function(err,commentCount){
                    Comment.find({article:newestArticle._id}).sort({'meta.createAt':-1}).limit(10).populate('from reply.from reply.to', 'username').exec(function(err,comment){
                        if(err)console.log('newestArticle: '+err)
                        res.json({article:newestArticle,comment:comment,commentCount:commentCount})
                    })
                })
            }
        })
    },
    Article: function(req,res){
        var id = req.params.id
        Article.findOne({_id:id}).populate('classify', 'name').exec(function(err,article){
            Comment.count({article:id}).exec(function(err,commentCount){
                Comment.find({article:id}).sort({'meta.createAt':-1}).limit(10).populate('from reply.from reply.to', 'username').exec(function(err,comment){
                    if(err)console.log('Article: '+err)
                    res.json({article:article,comment:comment,commentCount:commentCount})   
                })
            })
        })
    },

    //comment
    comment: function(req,res){
        var commentObj = req.body, _comment 
        commentObj.from = req.session.user._id
        commentObj.createAt = Date.now()
        _comment = new Comment(commentObj)
        _comment.save(function(err,comment){
            if(err)console.log('Comment: '+err)
            res.json(comment)
        }) 
    },
    reply: function(req,res){
        var _reply = req.body
        Comment.findById(_reply.cid).exec(function(err,comment){
            var reply = {from: req.session.user._id,
                        to: _reply.tid,
                        content: _reply.content,
                        createAt: Date.now()}
                comment.reply.push(reply)
                comment.save(function(err,comment){
                    if(err)console.log('Reply: '+err)
                    res.json(comment)
                })
            }) 
    },
    getComment: function(req,res){
        var aid = req.query.aid
        var pageSize = 10                               //一页多少条
        var currentPage = parseInt(req.query.page)          //当前第几页
        var sort = {'createAt':-1}                     //（按时间排序）
        var skipnum = (currentPage - 1) * pageSize   //跳过数
        Comment.find({article:aid}).skip(skipnum).sort(sort).limit(pageSize).populate('from reply.from reply.to', 'username').exec(function(err,comment){
            res.json(comment)
        })
    }, 
    commentCount: function(req,res){
        var id = req.params.id
        Comment.count({article:id}).exec(function(err,count){
            res.json(count)
        })
    },

    //user
    register: function(req,res){
        var _user = new User({
            username:req.body.username,
            password:req.body.password,
            meta:{
                createAt:Date.now()
            }
        })
        _user.save(function(err,result){
            if(err)console.log('register: '+err) 
            res.json(result) 
        })
    },
    rePassword: function(req,res){
        if(!!req.session.user){
            var oldPass = req.body.oldPass, newPass = req.body.newPass
            User.findOne({_id:req.session.user._id}).exec(function(err,user){
                if(err)console.log('rePassword: '+err)
                user.comparePassword(oldPass, function(err, isMatch) {
                    if(err)console.log('rePassword: '+err)
                    if(isMatch) {
                        user.password = newPass
                        user.save(function(err,result){
                            delete req.session.user
                            if(err)console.log('rePassword: '+err)  
                            res.json(result) 
                        })
                    }else{
                        return res.json('')
                    }
                }) 
            })
        }else{
            return res.json('')
        }
    },
    userIsExistence: function(req,res){
        User.findOne({username:req.body.username}).exec(function(err,result){
            if(err)console.log('userIsExistence: '+err)
            res.json(result)
        })
    },
    login: function(req,res){
        User.findOne({username:req.body.username}).exec(function(err,user){
            if(err)console.log('Login: '+err)
            if(!user)return res.json('')
            user.comparePassword(req.body.password, function(err, isMatch) {
                if(err)console.log('Login: '+err)
                if(isMatch) {
                    req.session.user = user
                    User.update({'_id':user._id},{'meta.updateAt':Date.now()},function(err,result){})
                    return res.json(user)
                }
                return res.json('')
            }) 
        })
    },
    logout: function(req,res){
        delete req.session.user
        res.json({success:1})
    },
    userSession: function(req,res){
        if(!!req.session.user){
            return  res.json(req.session.user)  
        }
        return  res.json('') 
    },
    userCount: function(req,res){
        User.count({},function(err,count){
            if(err)console.log('userCount: '+err)
            res.json(count)
        })
    },
    userList: function(req,res){
        var pageSize = 10                //一页多少条
        var currentPage = parseInt(req.params.id)  //当前第几页
        var sort = {'meta.updateAt':-1}        //（按登录时间排序）
        var skipnum = (currentPage - 1) * pageSize   //跳过数
        User.find({},{'password':0}).skip(skipnum).limit(pageSize).sort(sort).exec(function (err, result) {
            if (err) console.log('userList: '+err)
            res.json(result)
        })
    },
    delUser: function(req,res){
        var id = req.params.id
        User.remove({_id:id}).exec(function(err,result){
            if(err)console.log('delUser; '+err)
            res.json({success:1})
        })
    },


    //admin
    editArticle: function(req,res) {
        var id = req.params.id
        Article.findOne({_id:id}).exec(function(err,Article){
            if(err)console.log('editArticle: '+err)
            res.json(Article)  
        })
    },
    isAdmin: function(req,res){
        if(req.session.user.role > 0){
            res.json({success:req.session.user.role})
        }else{
            res.json({success:0})
        }
    },
    newArticle:function(req,res){
        var id = req.body._id, webObj = req.body, _web
        if(!id){
            _web = new Article({
                classify:webObj.classify,
                title:webObj.title,          
                content:webObj.content,
                meta:{
                createAt:Date.now(),
                updateAt:Date.now()
                }
            })
            _web.save(function(err,newArticle){
                res.json(newArticle) 
            })
        }else{
            Article.findById(id,function(err,data){
                if(err)console.log('newArticle: '+err)
                data.meta.updateAt = Date.now()
                _web = _.extend(data,webObj)
                _web.save(function(err,newArticle){
                    if(err)console.log('newArticle: '+err)
                        res.json(newArticle) 
                }) 
            })
        } 
    },
    delArticle: function(req,res) {
        var id = req.params.id
        Article.remove({_id:id}).exec(function(err,result){
            if(err)console.log('delArticle: '+err)
            res.json(result)
        })
    },
    articleCount: function(req,res){
        var classify = req.params.id
        Article.count({classify:classify},function(err,ArticleCount){
            if(err)console.log('ArticleCount: '+err)
            res.json(ArticleCount)
        }) 
    },
    articleList: function(req,res) {
        var pageSize = 10                //一页多少条
        var currentPage = parseInt(req.query.page)  //当前第几页
        var sort = {'meta.createAt':-1}        //（按创建时间排序）
        var condition = {'classify':req.query.classify}                 //条件
        var skipnum = (currentPage - 1) * pageSize   //跳过数
        Article.find(condition,{'content':0}).skip(skipnum).limit(pageSize).sort(sort).exec(function (err,ArticleList) {
            if(err)console.log('ArticleList: '+err)
            res.json(ArticleList)
        })
    },
    classify: function(req,res){
        Classify.find({},{'meta': 0},function(err,classify){
            res.json(classify)
        })
    },
    delClassify: function(req,res) {
        var id = req.params.id
        Classify.remove({_id:id}).exec(function(err,result) {
            if(err)console.log('delClassify: '+err)
            Article.remove({type:id}).exec(function(err,delClassify){
                if(err)console.log('delClassify: '+err)
                res.json(delClassify)
            })
        })
    },
    addClassify: function(req,res) {
        var id = req.body._id

        var typeObj = req.body
        var _type  
        if(!id){
            _type = new Classify({
                name:typeObj.name,
                meta:{
                createAt:Date.now(),
                updateAt:Date.now()
                }
            })
           
            _type.save(function(err,result){
                if(err)console.log('addClassify: '+err)
                res.json(result)
            console.log(result)  
            })
        }else{
            Classify.update({'_id':id},{'name':typeObj.name,'meta.updateAt':Date.now()},function(err,result){
                if(err)console.log('addClassify: '+err)
                res.json(result) 
            })
        }   
    } 
 }
