const express = require('express')
const utils = require('utility') // md5加密算法
const Router = express.Router()
const Admin = require('../../models/admin.js')
const _filter = { pwd: 0, __v: 0 }
//  注册
// Router.post('/register', function(req, res) {
//   const { admin, pwd, roles, avatar } = req.body
//   Admin.findOne({ admin }, function(err, doc) {
//     if (doc) {
//       return res.json({ code: 1, msg: '用户已存在' })
//     }
//     const adminModel = new Admin({ admin, pwd: md5Pwd(pwd), roles, avatar })
//     adminModel.save(function(e, d) {
//       if (e) {
//         console.log('e', e)
//         return res.json({ code: 1, msg: '后端出错了' })
//       }
//       const { admin, _id } = d
//       return res.json({ code: 0, data: { admin, _id } })
//     })
//   })
// })

// 登录
Router.post('/login', function(req, res) {
  const { admin, pwd } = req.body
  Admin.findOne({ admin }, function(err, doc) {
    if (!doc) {
      return res.json({ code: 1, msg: '用户不存在' })
    }
    if (md5Pwd(pwd) == doc.pwd) {
      req.session.admin = doc._id
      res.cookie('admin', doc._id, {
        maxAge: 60 * 100000
      })
      return res.json({ code: 0, data: { doc }, new: 1 })
    } else {
      return res.json({ code: 1, msg: '密码错误' })
    }
  })
})

// 获取登录信息
Router.get('/info', function(req, res) {
  if (!req.session.admin) {
    return res.json({ code: 1, msg: '用户未登陆' })
  }
  Admin.findById({ _id: req.session.admin }, _filter, function(err, doc) {
    if (err) {
      return res.json({ code: 1, msg: '后端出错了' })
    }
    if (doc) {
      return res.json({ code: 0, data: doc })
    }
  })
})

//  获取所有管理员
Router.get('/all', function(req, res) {
  Admin.find({}).exec(function(err, item) {
    if (err) {
      res.json({ code: 0, msg: '后端出错' })
    } else {
      res.json({ code: 1, result: item })
    }
  })
})

// 更新Admin
Router.post('/update', function(req, res) {
  const body = req.body
  console.log('body', body)
  Admin.findByIdAndUpdate(body.id, body.params, function(err, doc) {
    const data = Object.assign(
      {},
      {
        admin: doc.admin,
        roles: doc.roles
      },
      body.params
    )
    return res.json({ code: 0, data })
  })
})

// 删除Admin
Router.post('/delete', function(req, res) {
  Admin.remove({ _id: req.body.id }, function(err, doc) {
    return res.json({ code: 0, msg: '删除成功' })
  })
})

// 登出
Router.post('/logout', function(req, res) {
  res.cookie('admin', '', { expires: new Date(0) })
  return res.json({ code: 1, msg: '已退出登录' })
})
function md5Pwd(pwd) {
  const salt = 'fancy_store_3987!~@xxx'
  return utils.md5(utils.md5(pwd + salt))
}

module.exports = Router
