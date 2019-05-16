const express = require('express')
const utils = require('utility') // md5加密算法
const Router = express.Router()
const model = require('../../models/user')
const User = model.getModel('user')
const _filter = { pwd: 0, __v: 0 }
//  注册
Router.post('/register', function(req, res) {
  const { user, pwd } = req.body
  User.findOne({ user }, function(err, doc) {
    if (doc) {
      return res.json({ code: 1, msg: '用户已存在' })
    }
    const userModel = new User({ user, pwd: md5Pwd(pwd) })
    userModel.save(function(e, d) {
      if (e) {
        console.log('e', e)
        return res.json({ code: 1, msg: '后端出错了' })
      }
      const { user, _id } = d
      return res.json({ code: 0, data: { user, _id } })
    })
  })
})

// 登录
Router.post('/login', function(req, res) {
  const { user, pwd } = req.body
  User.findOne(
    { user },
    { carts: 1, user: 1, avatar: 1, pwd: 1, address: 1 },
    function(err, doc) {
      if (!doc) {
        return res.json({ code: 1, msg: '用户不存在' })
      }
      if (md5Pwd(pwd) == doc.pwd) {
        req.session.userName = doc._id
        return res.json({
          code: 0,
          result: {
            carts: doc.carts,
            userInfo: { user: doc.user, avatar: doc.avatar },
            address: doc.address.filter(item => item.checked)
          }
        })
      } else {
        return res.json({ code: 1, msg: '密码错误' })
      }
    }
  )
})

// 登出
Router.post('/logout', function(req, res) {
  req.session.userName = null
  return res.json({ code: 1, msg: '已退出登录' })
})

//  获取所有用户
Router.get('/all', function(req, res) {
  User.find({}).exec(function(err, item) {
    if (err) {
      res.json({ code: 0, msg: '后端出错' })
    } else {
      res.json({ code: 1, result: item })
    }
  })
})
// 获取信息
Router.get('/info', function(req, res) {
  User.findById({ _id: req.session.userName }, _filter, function(err, doc) {
    if (err) {
      return res.json({ code: 1, msg: '后端出错了' })
    }
    if (doc) {
      return res.json({ code: 0, result: doc })
    }
  })
})

// 更新User
Router.post('/update', function(req, res) {
  const body = req.body
  User.findByIdAndUpdate(
    req.session.userName,
    { sex: body.sex, avatar: body.avatar },
    function(err, doc) {
      return res.json({ code: 0, doc })
    }
  )
})

// 删除
Router.post('/delete', function(req, res) {
  User.remove({ _id: req.body.id }, function(err, doc) {
    return res.json({ code: 0, msg: '删除成功' })
  })
})

function md5Pwd(pwd) {
  const salt = 'fancy_store_3987!~@xxx'
  return utils.md5(utils.md5(pwd + salt))
}

module.exports = Router
