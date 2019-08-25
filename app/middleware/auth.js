const Admin = require('../models/admin')
const authMiddleWare = function(req, res, next) {
  let authRouter = [
    '/api/product/delete',
    '/api/product/add',
    '/api/product/update',
    '/api/category/delete',
    '/api/category/add'
  ]
  if (authRouter.includes(req.url)) {
    if (req.session.admin) {
      Admin.findById({ _id: req.session.admin }, function(err, doc) {
        if (doc.roles.includes(0) || doc.roles.includes(1)) {
          next()
        } else {
          return res.json({ code: -1, msg: '没有权限' })
        }
      })
    } else {
      return res.json({ code: -1, msg: '管理员未登陆' })
    }
  } else {
    next()
  }
}

module.exports = authMiddleWare
