const express = require('express')
const app = express()
const path = require('path')
const config = require('./func/config')
const router = require('./routes')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const winston = require('winston') // 记录日志
const expressWinston = require('express-winston') // 记录日志
config.readfile() // 初始化加载配置文件

// 设置模版引擎
app.set('views', path.join(__dirname, 'views')) // 设置存放模板文件的目录
app.set('view engine', 'ejs')

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))

// session 中间件
app.use(session({
  name: config.get('app').session.key, // 设置cookie 中保存 session ID 的字段名称
  secret: config.get('app').session.secret, // 通过设置 secret 来计算 hash值并放在cookie中，产生的signedCookie防篡改
  resave: true, // 强制更新 session 每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录, 无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
  cookie: {
    maxAge: config.get('app').session.maxAge // 过期时间,过期后cookie中的sessionid自动删除
  },
  store: new MongoStore({
    url: 'mongodb://' + config.get('app').mongoDB.address + ':' + config.get('app').mongoDB.port + '/' + config.get('app').mongoDB.db
  })
}))

// flash 中间件,用来显示通知
app.use(flash())

// 处理表单及文件上传中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'), // 上传目录
  keepExtensions: true // 保留后缀
}))

// 设置模板全局变量
app.locals.blog = {
  title: config.get('app').blogMsg.name,
  description: config.get('app').blogMsg.description
}

// 添加模板必须的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}))
// 路由
router(app)

// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}))
/*
app.use(function (req, res, next) {
  var err = new Error('请求异常')
  err.status = 404
  next(err)// 如果使用了 next(error)，则会返回错误而不会传递到下一个中间件
}) */

/* app.use(function (err, req, res, next) {
  // console.error(err)
  req.flash('error', err.message)
  res.redirect('/posts')
}) */

console.log('监听端口：' + config.get('app').main.httpPort)
// 监听端口
app.listen(config.get('app').main.httpPort)
