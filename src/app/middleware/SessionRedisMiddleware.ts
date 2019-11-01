import connectRedis from "connect-redis";
import redisConfig from "@config/redis";
import session from "express-session";

const redisStore = connectRedis(session);
const sessionRedis = session({
  store: new redisStore({
    client: redisConfig,
    prefix: "fancystore"
  }),
  secret: "fancystore",
  name: "fancystore_id", // 保存在cookie的一个名字，默认为connect.sid可以不设置
  resave: false, // 强制保存session即使它并没有变化，默认为true,建议设置成false
  saveUninitialized: true, // 建议将未初始化的session存储，默认值为true,建议设置成true
  cookie: {
    path: "/",
    httpOnly: true,
    // domain: 'fancystore.cn',
    maxAge: 60 * 100000
  }
  // rolling:true, // 持续刷新过期时间，只有持续不刷新会生效
});

export default sessionRedis;
