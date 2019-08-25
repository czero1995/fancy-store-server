const express = require('express')
const Router = express.Router()
const Cart = require('../../models/cart.js')
const Product = require('../../models/product.js')
const User = require('../../models/user.js')
const _filter = { detailInfo: 0, __v: 0 }
const uuid = require('node-uuid')
// 添加
Router.post('/add', function(req, res) {
  const info = req.body
  User.findById({ _id: req.session.userName }, function(err, userDoc) {
    if (userDoc) {
      if (userDoc.carts.length > 0) {
        if (
          userDoc.carts.some(item => {
            return item.productId == info.id
          })
        ) {
          userDoc.carts.forEach(item => {
            item.productId == info.id && item.num++
          })
        } else {
          let cartInfo = { _id: uuid.v4(), productId: info.id, num: 1 }
          userDoc.carts.push(cartInfo)
        }
      } else {
        let cartInfo = { _id: uuid.v4(), productId: info.id, num: 1 }
        userDoc.carts.push(cartInfo)
      }
      User.findByIdAndUpdate(
        req.session.userName,
        {
          carts: userDoc.carts
        },
        function(err, doc) {
          if (doc) {
            return res.json({ code: 1, msg: '添加成功' })
          }
        }
      )
    }
  })
})

Router.get('/all', function(req, res) {
  let array = []
  User.findById({ _id: req.session.userName }, function(err, userDoc) {
    if (userDoc) {
      userDoc.carts.forEach(item => {
        Product.findById({ _id: item.productId, _filter }, function(err, doc) {
          if (doc) {
            doc = JSON.parse(JSON.stringify(doc))
            doc.num = item.num
            array.push(doc)
          }
        }).sort({ id: -1 })
      })
      setTimeout(() => {
        return res.json({ code: 1, result: array })
      }, 300)
    }
  })
})

// 删除
Router.post('/delete', function(req, res) {
  let newCarts = []
  User.findById({ _id: req.session.userName }, function(err, userDoc) {
    if (userDoc) {
      userDoc.carts.forEach((item, index) => {
        if (item.productId == req.body.id) {
          userDoc.carts.splice(index, 1)
          newCarts = userDoc.carts
        }
      })
      User.findByIdAndUpdate(
        req.session.userName,
        {
          carts: newCarts
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
  User.findById({ _id: req.session.userName }, function(err, userDoc) {
    if (userDoc) {
      userDoc.carts.forEach((item, index) => {
        if (item.productId == req.body.id) {
          req.body.add == 'add' ? item.num++ : item.num--
        }
      })
      User.findByIdAndUpdate(
        req.session.userName,
        {
          carts: userDoc.carts
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
