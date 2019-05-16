const express = require('express')
const Router = express.Router()
const model = require('../../models/banner')
const Banner = model.getModel('banner')
Router.post('/add', function(req, res) {
  const info = req.body
  Banner.findOne({ title: info.title }, function(err, doc) {
    if (doc) {
      return res.json({ code: 1, msg: 'banner已存在' })
    }
    const model = new Banner(info)
    model.save(function(e, d) {
      if (e) {
        return res.json({ code: 1, msg: '后端出错了' })
      }
      return res.json({ code: 0, data: d })
    })
  })
})

Router.get('/all', function(req, res) {
  Banner.find({})
    .sort({ id: -1 })
    .exec(function(err, item) {
      if (err) {
        res.json({ code: 0, msg: '后端出错' })
      } else {
        res.json({ code: 1, result: item })
      }
    })
})

Router.get('/detail', function(req, res) {
  Banner.findById({ _id: req.query.id }, function(err, doc) {
    if (err) {
      res.json({ code: 1, msg: '后端出错' })
    } else {
      return res.json({ code: 0, result: doc })
    }
  })
})
// 删除
Router.post('/delete', function(req, res) {
  Banner.remove({ _id: req.body.id }, function(err, doc) {
    return res.json({ code: 0, msg: '删除成功' })
  })
})

Router.post('/update', function(req, res) {
  const body = req.body
  Banner.findByIdAndUpdate(body.id, body.params, function(err, doc) {
    const data = Object.assign(
      {},
      {
        title: doc.title,
        url: doc.url,
        img: doc.img
      },
      body.params
    )
    return res.json({ code: 0, data })
  })
})
module.exports = Router
