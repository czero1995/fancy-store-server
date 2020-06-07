import config from "@config/config";
import RedisProvider from "@middleware/RedisProvider";
import Redis from "@config/redis";
const REDIS_KEY = `${config.REDIS_PRODECT_PREFIX}:sessionId`;
const redisProvider = new RedisProvider(Redis);
import { decrypt } from "@util/Util";
import userRepo from "@model/User";
const AuthMiddleware = async function(req, res, next) {
  const authRouter = [
    "/api/product/delete",
    "/api/product/add",
    "/api/product/update",
    "/api/category/delete",
    "/api/category/add",
    "/api/admin/register"
  ];
  if (authRouter.includes(req.url)) {
    if (!req.headers.sessionid) {
      return res.json({ code: -1, msg: "用户未登陆" });
    }
    const sessionId = req.headers.sessionid;
    const redisValue = await redisProvider.get(REDIS_KEY + sessionId);
    if (redisValue && redisValue === decrypt(sessionId)) {
      const isExist = await userRepo
        .findOne({
          uid: decrypt(req.headers.sessionid)
        })
        .lean(true);
      if (isExist && isExist.roles.includes(1)) {
        next();
      } else {
        console.log("没有权限");
        return res.json({ code: -1, msg: "没有权限" });
      }
    } else {
      return res.json({ code: -1, msg: "用户未登陆" });
    }
  } else {
    next();
  }
};

export default AuthMiddleware;
