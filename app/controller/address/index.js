const express = require('express')
const Router = express.Router()
const modelUser = require('../../models/user')
const User = modelUser.getModel('user')
const uuid = require('node-uuid')
// 添加
Router.post('/add', function(req, res) {
  let body = req.body.addressInfo
  User.findById({ _id: req.session.userName }, function(err, userDoc) {
    if (userDoc) {
      if (body.checked) {
        userDoc.address = userDoc.address.map(item => {
          item.checked = false
        })
      }
      userDoc.address.push({
        id: uuid.v4(),
        name: body.name,
        tel: body.tel,
        post: body.post,
        address: body.address,
        detailAddress: body.detailAddress,
        checked: body.checked
      })
      User.findByIdAndUpdate(
        req.session.userName,
        {
          address: userDoc.address
        },
        function(err, doc) {
          if (doc) {
            return res.json({ code: 1, msg: doc })
          }
        }
      )
    } else {
    }
  })
})

Router.get('/all', function(req, res) {
  User.findById({ _id: req.session.userName }, function(err, userDoc) {
    if (userDoc) {
      return res.json({ code: 1, result: userDoc.address })
    }
  })
})
// 删除
Router.post('/delete', function(req, res) {
  let newAddress = []
  User.findById({ _id: req.session.userName }, function(err, userDoc) {
    if (userDoc) {
      userDoc.address.forEach((item, index) => {
        if (item.id == req.body.id) {
          userDoc.address.splice(index, 1)
          newAddress = userDoc.address
        }
      })
      User.findByIdAndUpdate(
        req.session.userName,
        {
          address: newAddress
        },
        function(err, doc) {
          if (doc) {
            return res.json({ code: 0, result: doc })
          }
        }
      )
    }
  })
})

Router.post('/update', function(req, res) {
  let body = req.body.addressInfo
  User.findById({ _id: req.session.userName }, function(err, userDoc) {
    if (userDoc) {
      if (body.checked) {
        userDoc.address.forEach(item => {
          item.checked = false
        })
      }
      userDoc.address.forEach((item, index) => {
        if (item.id == req.query.id) {
          item.name = body.name
          item.tel = body.tel
          item.post = body.post
          item.address = body.address
          item.detailAddress = body.detailAddress
          item.checked = body.checked
        }
      })
      User.findByIdAndUpdate(
        req.session.userName,
        {
          address: userDoc.address
        },
        function(err, doc) {
          if (doc) {
            return res.json({ code: 0, result: doc })
          }
        }
      )
    }
  })
})
module.exports = Router
