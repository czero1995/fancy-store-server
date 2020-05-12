import config from "@config/config";
import RedisProvider from "@middleware/RedisProvider";
import Redis from "@config/redis";
const REDIS_KEY = `${config.REDIS_PRODECT_PREFIX}:sessionId`;
const redisProvider = new RedisProvider(Redis);
import { decrypt } from "@util/Util";
const LoginMiddleWare = async function(req, res, next) {
  const loginRouter = [
    "/api/cart/all",
    "/api/cart/add",
    "/api/cart/delete",
    "/api/cart/update",
    "/api/order/all",
    "/api/order/add",
    "/api/order/delete",
    "/api/order/update",
    "/api/user/logout",
    "/api/user/info",
    "/api/user/update",
    "/api/address/add",
    "/api/address/all"
    // "/api/category/all"
  ];
  if (loginRouter.includes(req.url)) {
    if (!req.headers.sessionid) {
      return res.json({ code: -1, msg: "用户未登陆" });
    }
    const sessionId = req.headers.sessionid;
    const redisValue = await redisProvider.get(REDIS_KEY + sessionId);
    if (redisValue && redisValue === decrypt(sessionId)) {
      next();
    } else {
      return res.json({ code: -1, msg: "用户未登陆" });
    }
  } else {
    next();
  }
};

export default LoginMiddleWare;
