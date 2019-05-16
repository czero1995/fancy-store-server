const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const redisStore = require('connect-redis')(session)
const redis = require('./config/redis').redis
const adminRouter = require('./app/controller/admin/index')
const userRouter = require('./app/controller/user/index')
const productRouter = require('./app/controller/product/index')
const categoryRouter = require('./app/controller/category/index')
const cartRouter = require('./app/controller/cart/index')
const orderRouter = require('./app/controller/order/index')
const addressRouter = require('./app/controller/address/index')
const bannerRouter = require('./app/controller/banner/index')
const qiniuToken = require('./app/controller/upload/token')
const methods = ['get', 'post', 'put', 'delete']
const model = require('./app/models/admin')
const Admin = model.getModel('admin')
var cors = require('cors')
var app = express()
app.use(cookieParser('fancystore'))
app.use(
  session({
    store: new redisStore({
      client: redis,
      prefix: 'fancystore'
    }),
    secret: 'fancystore',
    name: 'fancystore_id', // 保存在cookie的一个名字，默认为connect.sid可以不设置
    resave: false, // 强制保存session即使它并没有变化，默认为true,建议设置成false
    saveUninitialized: true, //建议将未初始化的session存储，默认值为true,建议设置成true
    cookie: {
      path: '/',
      httpOnly: true,
      // domain: 'fancystore.cn',
      maxAge: 60 * 100000
    }
    // rolling:true, // 持续刷新过期时间，只有持续不刷新会生效
  })
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  cors({
    origin: [
      // 'http://localhost:8080',
      'http://admin.fancystore.cn'
    ],
    credentials: true,
    maxAge: '1728000'
  })
)
app.use(function(req, res, next) {
  let authRouter = [
    '/api/cart/all',
    '/api/cart/add',
    '/api/cart/delete',
    '/api/cart/update',
    '/api/order/all',
    '/api/order/add',
    '/api/order/delete',
    '/api/order/update',
    '/api/user/logout',
    '/api/user/info',
    '/api/user/update',
    '/api/address/add',
    '/api/address/all'
  ]
  if (authRouter.includes(req.url)) {
    if (req.session.userName) {
      next()
    } else {
      return res.json({ code: -1, msg: '用户未登陆' })
    }
  } else {
    next()
  }
})
app.use(function(req, res, next) {
  let adminRouter = [
    '/api/address/delete',
    '/api/product/delete',
    '/api/product/add',
    '/api/product/update',
    '/api/category/delete',
    '/api/category/add'
  ]
  if (adminRouter.includes(req.url)) {
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
})
for (let method of methods) {
  app[method] = function(...data) {
    if (method === 'get' && data.length === 1) return app.set(data[0])

    const params = []
    for (let item of data) {
      if (Object.prototype.toString.call(item) !== '[object AsyncFunction]') {
        params.push(item)
        continue
      }
      const handle = function(...data) {
        const [req, res, next] = data
        item(req, res, next)
          .then(next)
          .catch(next)
      }
      params.push(handle)
    }
    router[method](...params)
  }
}
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/category', categoryRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/address', addressRouter)
app.use('/api/banner', bannerRouter)
app.use('/api/admin', adminRouter)
app.use('/api/token', qiniuToken)
app.use(function(err, req, res, next) {
  res.status(404)
  console.log('Error Happends ******', err.stack)
})

app.listen(9093, function() {
  console.log('Node app start at port 9093')
})
