const express = require('express')
const Router = express.Router()
const Category = require('../../models/category.js')
const redisClient = require('../../../config/redis')
const config = require('../../../config/config')

// 添加Category
Router.post('/add', function(req, res) {
  const info = req.body
  Category.findOne({ title: info.title }, function(err, doc) {
    if (doc) {
      return res.json({ code: 1, msg: '标签已经存在' })
    }
    const modelCategory = new Category(info)
    modelCategory.save(function(e, d) {
      if (e) {
        console.log('e', e)
        return res.json({ code: 1, msg: '后端出错了' })
      }
      redisClient.lpush(
        config.REDIS_PRODECT_PREFIX + 'category',
        JSON.stringify(d)
      )
      return res.json({ code: 0, data: d })
    })
  })
})

//  获取Category
Router.get('/all', async function(req, res) {
  getCategoryRedis(function(err, doc) {
    if (err) return res.json({ code: 0, msg: 'error' })
    if (!doc) {
      getCategotyDB(function(err, doc) {
        if (err) return res.json({ code: 0, msg: 'error' })
        if (!doc) return res.json({ code: 1, result: '不存在' })
        return res.json({ code: 1, result: doc })
      })
    } else {
      return res.json({ code: 1, result: doc })
    }
  })
})

function getCategoryRedis(cb) {
  redisClient.lrange(config.REDIS_PRODECT_PREFIX + 'category', 0, -1, function(
    err,
    lists
  ) {
    if (lists.length == 0) {
      return cb(null, null)
    }
    try {
    } catch (e) {
      cb(e, null)
    }
    return cb(err, JSON.parse(lists))
  })
}
function getCategotyDB(cb) {
  Category.find({})
    .sort({ id: -1 })
    .exec(function(err, doc) {
      if (err) {
        res.json({ code: 0, msg: '后端出错' })
      } else {
        redisClient.lpush(
          config.REDIS_PRODECT_PREFIX + 'category',
          JSON.stringify(doc)
        )
        return cb(err, doc)
      }
    })
}
// 删除Category
Router.post('/delete', function(req, res) {
  Category.remove({ _id: req.body.id }, function(err, doc) {
    redisClient.lpop(config.REDIS_PRODECT_PREFIX + 'category')
    return res.json({ code: 0, msg: '删除成功' })
  })
})
module.exports = Router
