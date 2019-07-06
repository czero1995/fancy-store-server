const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const compression = require('compression')
const adminRouter = require('../app/controller/admin/index')
const userRouter = require('../app/controller/user/index')
const productRouter = require('../app/controller/product/index')
const categoryRouter = require('../app/controller/category/index')
const cartRouter = require('../app/controller/cart/index')
const orderRouter = require('../app/controller/order/index')
const addressRouter = require('../app/controller/address/index')
const bannerRouter = require('../app/controller/banner/index')
const qiniuToken = require('../app/controller/upload/token')
const initMididleware = require('../app/middleware/InitMiddleware')
const authMiddleWare = require('../app/middleware/auth')
const loginMiddleWare = require('../app/middleware/login')
const methods = ['get', 'post', 'put', 'delete']
// for (let method of methods) {
//   app[method] = function(...data) {
//     if (method === 'get' && data.length === 1) return app.set(data[0])

//     const params = []
//     for (let item of data) {
//       if (Object.prototype.toString.call(item) !== '[object AsyncFunction]') {
//         params.push(item)
//         continue
//       }
//       const handle = function(...data) {
//         const [req, res, next] = data
//         item(req, res, next)
//           .then(next)
//           .catch(next)
//       }
//       params.push(handle)
//     }
//     router[method](...params)
//   }
// }
router.use(compression())
router.use(loginMiddleWare)
router.use(authMiddleWare)
router.use(initMididleware)
router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
router.use(bodyParser.json({limit: '50mb'}));
router.use('/api/user', userRouter)
router.use('/api/product', productRouter)
router.use('/api/category', categoryRouter)
router.use('/api/cart', cartRouter)
router.use('/api/order', orderRouter)
router.use('/api/address', addressRouter)
router.use('/api/banner', bannerRouter)
router.use('/api/admin', adminRouter)
router.use('/api/token', qiniuToken)
module.exports = router
