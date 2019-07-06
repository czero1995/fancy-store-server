const express = require('express')
const app = express()
const compression = require('compression')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const redisStore = require('connect-redis')(session)
const redis = require('./config/redis').redis
const cors = require('cors')
const router = require('./router/index.js')
const authMiddleWare = require('./app/middleware/auth')
const loginMiddleWare = require('./app/middleware/login')
app.use(compression())
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
      'https://admin.fancystore.cn'
    ],
    credentials: true,
    maxAge: '1728000'
  })
)
app.use(loginMiddleWare)
app.use(authMiddleWare)

app.use(router)
app.use(function(err, req, res, next) {
  res.json({ status: 405, err: err.stack })
  console.log('Error Happends ******', err.stack)
})

app.listen(9093, function() {
  console.log('Node app start at port 9093')
})
