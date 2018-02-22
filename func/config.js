/**
 * 说明:读取配置文件,并把配置文件放置缓存里
 * 时间:2018年1月29日 15:11:56
 */

/**
缓存配置模块！
注：此文件需要与配置文件放在同一目录中，配置文件必须是.json格式文件
使用方法:
var config = require('./config/config.js');
//读取或更新缓存
config.readfile();
//使用缓存内容
var conf = config.get("config");
console.log(conf.版本号);
*/

var fs = require('fs')
var cache = require('memory-cache')

var config = {}

// 更新缓存
config.readfile = function () {
  var dir = './config/'
  var files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    var file = files[i]
    if (file.substring(file.length - 5, file.length) === '.json') {
      var path = dir + '/' + file
      var config = fs.readFileSync(path)
      try {
        var json = JSON.parse(config.toString())
        var key = 'config/' + file.substring(0, file.length - 5)
        cache.put(key, json)
      } catch (e) {
        console.error('读取配置文件出现错误')
      }
    }
  }

  console.log('读取配置成功!')
}

// 获取缓存
config.get = function (key) {
  return cache.get('config/' + key)
}

// 设置缓存
config.set = function (key, obj) {
  try {
    cache.put('config/' + key, obj)
    return true
  } catch (e) {
    return false
  }
}

module.exports = config
