'use strict'
// 通过路由中间件去分发业务，相当于control层 C层

module.exports = function (app) {
  app.get('/', function (req, res) {
    // console.log('进来了2')
    // console.log('req.url:' + req.url)
    // console.log('分发业务')
    res.redirect('./posts')
  })

  app.use('/signup', require('./signup')) // 登录
  app.use('/signin', require('./signin')) // 注册
  app.use('/signout', require('./signout')) // 登出
  app.use('/posts', require('./posts')) // 发表文章
  app.use('/comments', require('./comments')) // 留言
  // 404页面
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404).render('404')
    }
  })
}
