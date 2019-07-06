const express = require('express')
const Router = express.Router()
const model = require('../../models/product')
const Product = model.getModel('product')
const _filter = { detailInfo: 0, __v: 0 }
const redisClient = require('../../../config/redis')
const config = require('../../../config/config')
const asyncMiddleware = require('../../middleware/asyncMiddleware')
// 添加Product
Router.post('/add', function(req, res) {
  const productInfo = req.body
  Product.findOne({ title: productInfo.title }, function(err, doc) {
    const productModel = new Product(productInfo)
    productModel.save(function(e, d) {
      if (e) {
        console.log('e', e)

        return res.json({ code: 1, msg: '后端出错了' })
      }
      return res.json({ code: 0, data: d })
    })
  })
})

//  获取Product
Router.get('/all', asyncMiddleware(async (req, res, next) => {
  const pageNum = parseInt(req.query.pageNum) || 0
  const pageSize = parseInt(req.query.pageSize) || 10
  const categorysa = req.query.category || ''
  const categorySearch = category != '' ? { category: category } : null
  
  Product.find(categorySearch, _filter)

    .skip(pageNum * pageSize)
    .limit(pageSize)
    .sort({ id: -1 })
    .exec(function(err, item) {
      if (err) {
        res.json({ code: 0, msg: '后端出错' })
      } else {
        item.category = item.category
        res.json({ code: 1, result: item })
      }
    })
}))
function timeout(ms) {
  return new Promise((resolve) => {
    setTimeot(resolve, ms);
  });
}
//  获取内容详情
Router.get('/detail', function(req, res) {
  // Product.findById({ _id: req.query.id }, function(err, doc) {
  //   if (err) {
  //     res.json({ code: 1, msg: '后端出错' })
  //   } else {
  //     return res.json({ code: 0, result: doc })
  //   }
  // })
  getDetailRedis(req.query.id, function(err, doc) {
    if (err) return res.json({ code: 0, msg: 'error' })

    if (!doc) {
      getDetailDB(req.query.id, function(err, doc) {
        if (err) return res.json({ code: 0, msg: 'errir' })
        if (!doc) return res.json({ code: 1, result: '不存在' })
        return res.json({ code: 1, result: doc })
      })
    } else {
      return res.json({ code: 1, result: doc })
    }
  })
})

function getDetailDB(id, cb) {
  Product.findById({ _id: id }, function(err, doc) {
    if (err) {
      res.json({ code: 1, msg: '后端出错' })
    } else {
      redisClient.set(config.REDIS_PRODECT_PREFIX + id, JSON.stringify(doc))
      return cb(err, doc)
    }
  })
}

function getDetailRedis(id, cb) {
  redisClient.get(config.REDIS_PRODECT_PREFIX + id, function(err, v) {
    if (!v) {
      return cb(null, null)
    }
    try {
      v = JSON.parse(v)
    } catch (e) {
      cb(e, null)
    }
    return cb(err, v)
  })
}

// 更新Product
Router.post('/update', function(req, res) {
  const body = req.body
  Product.findByIdAndUpdate(body.id, body.params, function(err, doc) {
    const data = Object.assign(
      {},
      {
        title: doc.title,
        subTitle: doc.subTitle,
        detailInfo: doc.detailInfo
      },
      body.params
    )
    redisClient.lpop(config.REDIS_PRODECT_PREFIX + 'product')
    return res.json({ code: 0, data })
  })
})

// 删除Product
Router.post('/delete', function(req, res) {
  Product.remove({ _id: req.body.id }, function(err, doc) {
    redisClient.lpop(config.REDIS_PRODECT_PREFIX + 'product')
    redisClient.lpop(config.REDIS_PRODECT_PREFIX + req.body.id)
    return res.json({ code: 0, msg: '删除成功' })
  })
})
module.exports = Router
