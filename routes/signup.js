/**
 * 注册
 */

const express = require('express')
const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const moment = require('moment')
const router = express.Router()
const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

//  /signup 注册页
router.get('/', function (req, res, next) {
  // console.log('进来注册页了')
  res.render('signup')
})

// POST /signup 用户注册
router.post('/', function (req, res, next) {
  // console.log(req.fields)
  // console.log(req.files)
  const name = req.fields.name
  const gender = req.fields.gender
  const bio = req.fields.bio
  const avatar = req.files.avatar.path.split(path.sep).pop()

  /* 'foo\\bar\\baz'.split(path.sep)
    // returns
    ['foo', 'bar', 'baz']
    .pop(),返回最后一个元素
  */
  let password = req.fields.password
  const repassword = req.fields.repassword

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在1-10个字符')
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是m、f或x')
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少头像')
    }
    if (password.length < 6) {
      throw new Error('密码至少6个字符')
    }
    if (password !== repassword) {
      throw new Error('两次密码不一致')
    }
  } catch (e) {
    // 注册失败,异步删除上传的头像
    fs.unlink(req.files.avatar.path)
    req.flash('error', e.message)
    return res.redirect('/signup')
  }

  // 明文密码加密
  password = sha1(password)

  // 待写入数据库的用户信息
  let user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar,
    signtime: moment().format('YYYY-MM-DD HH:mm:ss')
  }

  UserModel.create(user)
    .then(function (result) {
      // console.log('userRESULT' + JSON.stringify(result))
      user = result.ops[0]
      delete user.password
      req.session.user = user
      req.flash('success', '注册成功')
      res.redirect('/posts')
    })
    .catch(function (e) {
      console.log('发生错误了,捕获到错误。用户名已被占用')
      // 注册失败,异步删除上传的头像
      fs.unlink(req.files.avatar.path)
      // 用户名被占用则跳回注册页,而不是错误页
      if (e.message.match('duplicate key')) {
        req.flash('error', '用户名已被占用')
        return res.redirect('/signup')
      }
      next(e)
    })
})

module.exports = router
