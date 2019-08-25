const express = require('express')
const Router = express.Router()
const Product = require('../../models/product.js')
const User = require('../../models/user.js')
const uuid = require('node-uuid')
const _filter = { detailInfo: 0, __v: 0, detailInfo: 0 }
// 添加
Router.post('/add', function(req, res) {
  let info = req.body
  User.findById({ _id: req.session.userName }, function(err, userDoc) {
    if (userDoc) {
      userDoc.order.push({
        product: info.id,
        _id: uuid.v4(),
        address: info.address,
        status: info.status
      })
      User.findByIdAndUpdate(
        req.session.userName,
        {
          order: userDoc.order
        },
        function(err, doc) {
          if (doc) {
            return res.json({ code: 1, msg: '添加成功' })
          }
          if (err) {
            console.log('error', err)
          }
        }
      )
    }
  })
})

Router.get('/all', function(req, res) {
  if (!req.session.userName) {
    return res.json({ code: 1, msg: '用户未登陆' })
  }
  let orderArray = []
  User.findById({ _id: req.session.userName }, function(err, userDoc) {
    if (userDoc) {
      userDoc.order.forEach(item => {
        if (item.status == req.query.status) {
          orderArray.push(item)
        } else if (req.query.status == '') {
          orderArray.push(item)
        }
      })
      orderArray.forEach(item => {
        item.products = []
        item.product.forEach(itemChilld => {
          Product.findById({ _id: itemChilld.id, _filter }, function(err, doc) {
            if (doc) {
              item.products.push({
                imgCover: doc.imgCover,
                priceNow: doc.priceNow,
                title: doc.title,
                num: itemChilld.num,
                address: item.address
              })
            }
          })
        })
      })
      setTimeout(() => {
        return res.json({ code: 1, result: orderArray })
      }, 100)
    }
  })
})

// 删除
Router.post('/delete', function(req, res) {
  if (!req.session.userName) {
    return res.json({ code: 1, msg: '用户未登陆' })
  }
  let newOrder = []
  User.findById({ _id: req.session.userName }, function(err, userDoc) {
    if (userDoc) {
      userDoc.order.forEach((item, index) => {
        if (item._id == req.body.id) {
          userDoc.order.splice(index, 1)
          newOrder = userDoc.order
        }
      })
      User.findByIdAndUpdate(
        req.session.userName,
        {
          order: newOrder
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
  if (!req.session.userName) {
    return res.json({ code: 1, msg: '用户未登陆' })
  }
  let newCarts = []
  User.findById({ _id: req.session.userName }, function(err, userDoc) {
    if (userDoc) {
      userDoc.order.forEach((item, index) => {
        if (item._id == req.body.id) {
          item.status = req.body.status
        }
      })
      User.findByIdAndUpdate(
        req.session.userName,
        {
          order: userDoc.order
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
