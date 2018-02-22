'use strict'
// 通过路由中间件去分发业务，相当于control层 C层

module.exports = function (app) {
  app.get('/', function (req, res) {
    // console.log('进来了2')
    // console.log('req.url:' + req.url)
    // console.log('分发业务')
    res.redirect('./posts')
  })

  app.use('/signup', require('./signup'))
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/posts', require('./posts'))
  app.use('/comments', require('./comments'))
}
