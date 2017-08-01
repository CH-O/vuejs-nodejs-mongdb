var Method = require('./method')

module.exports = function(app){
	// home
	app.get('/allArticle',Method.allArticle)
	app.get('/newestArticle',Method.newestArticle)
	app.get('/Article/:id',Method.Article)

	//comment
	app.post('/comment',Method.comment)
	app.post('/reply',Method.reply)
	app.get('/getComment',Method.getComment)
	app.get('/commentCount/:id',Method.commentCount)

	//user
	app.post('/register',Method.register)
	app.post('/userIsExistence',Method.userIsExistence)
	app.post('/login',Method.login)
	app.get('/logout',Method.logout)
	app.get('/userSession',Method.userSession)
	app.get('/userCount',Method.userCount)
	app.get('/userList/:id',Method.userList)
	app.get('/delUser/:id',Method.delUser)
	app.post('/rePassword',Method.rePassword)
	
	//admin
	app.get('/editArticle/:id',Method.editArticle)
	app.get('/isAdmin',Method.isAdmin)
	app.post('/newArticle',Method.newArticle)
	app.delete('/delArticle/:id',Method.delArticle)
	app.get('/articleCount/:id',Method.articleCount)
	app.get('/articleList',Method.articleList)
	app.get('/classify',Method.classify)
	app.delete('/delClassify/:id',Method.delClassify)
	app.post('/addClassify',Method.addClassify)	
}