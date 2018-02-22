'use strict'
module.exports = {
  // 中间件用来检测用户是否登录
  checkLogin: function checkLogin (req, res, next) {
    // console.log('req.session.user1值:' + JSON.stringify(req.session.user))
    if (!req.session.user) {
      // session里面没有用户
      console.log('用户未登录')
      req.flash('error', '用户未登录')
      return res.redirect('/signin') // 重定向去登录
    };
    next()
  },
  checkNotLogin: function checkNotLogin (req, res, next) {
    // console.log('req.session.user值:' + req.session.user)
    if (req.session.user) {
      console.log('用户已登录')
      req.flash('error', '用户已登录')
      return res.redirect('back') // 返回之前的页面
    }
    next()
  }
}
