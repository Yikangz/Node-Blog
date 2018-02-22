
/**
 * 操作mongoDB方法
 */
const config = require('../func/config')
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
config.readfile() // 初始化加载配置文件

const url = 'mongodb://' + config.get('app').mongoDB.address + ':' + config.get('app').mongoDB.port + '/' + config.get('app').mongoDB.db
// console.log('mongoURL' + url)
mongolass.connect(url)

exports.User = mongolass.model('User', {
  name: {
    type: 'string',
    required: true
  },
  password: {
    type: 'string',
    required: true
  },
  avatar: {
    type: 'string',
    required: true
  },
  gender: {
    type: 'string',
    enum: ['m', 'f', 'x'],
    default: 'x'
  },
  bio: {
    type: 'string',
    required: true
  },
  signtime: {
    type: 'string'
  }
})

exports.User.index({
  name: 1
}, {
  unique: true
}).exec() // 根据用户名找用户,用户名全局唯一

// 文章
exports.Post = mongolass.model('Post', {
  author: {
    type: Mongolass.Types.ObjectId,
    required: true
  },
  title: {
    type: 'string',
    required: true
  },
  content: {
    type: 'string',
    required: true
  },
  signtime: {
    type: 'string'
  },
  pv: {
    type: 'number',
    default: 0
  }
})

exports.Post.index({
  author: 1,
  _id: -1
}).exec() // 按创建时间降序查看用户的文章列表

exports.Comment = mongolass.model('Comment', {
  author: {
    type: Mongolass.Types.ObjectId,
    required: true
  },
  content: {
    type: 'string',
    required: true
  },
  postId: {
    type: Mongolass.Types.ObjectId,
    required: true
  }
})
// 通过文章 id 获取该文章下的所有留言，按留言创建时间升序
exports.Comment.index({
  postId: 1,
  _id: 1
}).exec()
