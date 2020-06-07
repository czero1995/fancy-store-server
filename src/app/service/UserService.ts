import UidHelper from "@helper/UidHelper";
import VerificationHelper from "@helper/VerificationHelper";
import { md5Pwd, encrypt, decrypt, veifyField } from "@util/Util";
import config from "@config/config";
const REDIS_KEY = `${config.REDIS_PRODECT_PREFIX}:sessionId`;
import RedisProvider from "@middleware/RedisProvider";
export default class UserService {
  protected userRepo: any;
  protected redisProvider: any;
  constructor(user, redis) {
    this.userRepo = user;
    this.redisProvider = new RedisProvider(redis);
  }
  public async register(req: any) {
    const paramsInfo = req.body;
    const verifyObject = {
      user: VerificationHelper.isNonEmpty(paramsInfo.user, "请输入用户名"),
      pwd: VerificationHelper.isNonEmpty(paramsInfo.pwd, "请输入密码")
    };
    veifyField(verifyObject);

    const isExist = await this.userRepo.findOne({ user: paramsInfo.user });
    if (isExist) {
      return { code: -1, msg: "用户已存在" };
    }
    paramsInfo.uid = await UidHelper("User");
    paramsInfo.pwd = md5Pwd(paramsInfo.pwd);
    paramsInfo.created = Date.now();
    paramsInfo.updated = Date.now();
    const model = await new this.userRepo(paramsInfo);
    await model.save();
    return { code: 0, msg: "添加成功" };
  }

  public async update(req) {
    await this.userRepo.findOneAndUpdate(
      { uid: decrypt(req.headers.sessionid) },
      req.body.params,
      { new: true }
    );
    return { code: 0, msg: "更新成功" };
  }

  public async login(req) {
    const paramsInfo = req.body;
    const isExist = await this.userRepo.findOne({ user: paramsInfo.user });
    if (!isExist) {
      return { code: -1, msg: "用户不存在" };
    }
    if (md5Pwd(paramsInfo.pwd) === isExist.pwd) {
      const sessionID = encrypt(isExist.uid.toString());
      this.redisProvider.set(
        REDIS_KEY + sessionID,
        isExist.uid.toString(),
        false,
        10000
      );
      const { user, avatar, uid } = isExist;
      return {
        code: 0,
        msg: "登录成功",
        data: { user, avatar, uid, sessionID }
      };
    }
    return { code: -1, msg: "密码错误" };
  }

  public async info(req) {
    const data = await this.userRepo.findOne(
      { uid: decrypt(req.headers.sessionid) },
      {
        uid: 1,
        nickName: 1,
        user: 1,
        avatarUrl: 1,
        gender: 1,
        created: 1,
        updated: 1,
        roles: 1
      }
    );
    return { code: 0, data };
  }
}
