const marked = require('marked')
const Comment = require('../func/mongo').Comment

// 将comment的content 从markdown 转换成 html
Comment.plugin('contentToHtml', {
  afterFind: function (comments) {
    return comments.map(function (comment) {
      comment.content = marked(comment.content)
      return comment
    })
  }
})

module.exports = {
  // 创建一条留言
  create: function create (comment) {
    return Comment.create(comment).exec()
  },
  // 通过留言id 获取一个留言
  getCommentById: function getCommentById (commentId) {
    return Comment.findOne({
      _id: commentId
    }).exec()
  },
  // 通过留言id 删除一个留言
  delCommentById: function delCommentById (commentId) {
    return Comment.deleteOne({
      _id: commentId
    }).exec()
  },
  // 通过文章id 删除该文章下的所有留言
  delCommentsByPostId: function delCommentsByPostId (postId) {
    return Comment.deleteMany({
      postId: postId
    }).exec()
  },
  // 通过文章 id 获取该文章下的所有留言,按留言创建时间升序
  getComments: function getComments (postId) {
    return Comment
      .find({
        postId: postId
      })
      .populate({
        path: 'author',
        model: 'User'
      })
      .sort({
        _id: 1
      })
      .contentToHtml()
      .exec()
  },

  // 通过文章id 获取该文章下留言数
  getCommentsCount: function getCommentsCount (postId) {
    return Comment.count({ postId: postId }).exec()
  }

}
