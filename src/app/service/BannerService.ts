import UidHelper from "@helper/UidHelper";
import RedisProvider from "@middleware/RedisProvider";
import VerificationHelper from "@helper/VerificationHelper";
import { checkUid, veifyField } from "@util/Util";
import config from "@config/config";
const REDIS_KEY = `${config.REDIS_PRODECT_PREFIX}:banner`;

export default class BannerService {
  protected bannerRepo: any;
  protected redisProvider: any;
  constructor(banner, redis) {
    this.bannerRepo = banner;
    this.redisProvider = new RedisProvider(redis);
  }
  public async add(req): Promise<object> {
    const paramsInfo = req.body;
    const verifyObject = {
      title: VerificationHelper.isNonEmpty(paramsInfo.title, "请传入Banner标题")
    };
    veifyField(verifyObject);

    const isExist = await this.bannerRepo.findOne({
      title: paramsInfo.title
    });
    if (isExist) {
      return { code: 0, msg: "Banner已存在" };
    }
    paramsInfo.uid = await UidHelper("Banner");
    paramsInfo.created = Date.now();
    paramsInfo.updated = Date.now();
    const model = new this.bannerRepo(paramsInfo);
    const data = await model.save();
    await this.redisProvider.sadd(REDIS_KEY, JSON.stringify(data));
    return { code: 0, data };
  }

  public async all(req) {
    let data = await this.redisProvider.smembers(REDIS_KEY);
    if (data.length > 0) {
      // return data.map(item => JSON.parse(item));
    }
    const query: any = {};
    if (req.query.title && req.query.title.trim().length > 0) {
      query.title = { $regex: `${req.query.title}`, $options: "i" };
    }
    data = await this.bannerRepo.find(query).sort({ uid: -1 });
    // data.map(item => {
    //   this.redisProvider.sadd(REDIS_KEY, JSON.stringify(item));
    // });
    return data;
  }

  public async detail(req) {
    checkUid(req.query.uid, "请传入Banner uid");

    // let data = await RedisProvider.get(RedisProvider.getKey(REDIS_KEY, req.query.uid))
    // if (data) {
    //   return data
    // }
    const data = await this.bannerRepo.findOne({ uid: req.query.uid });
    // await RedisProvider.set(RedisProvider.getKey(REDIS_KEY, req.query.uid), data)
    return data;
  }

  public async update(req) {
    checkUid(req.body.uid, "请传入Banner uid");
    req.body.params.updated = Date.now();
    const data = await this.bannerRepo.findOneAndUpdate(
      { uid: req.body.uid },
      req.body.params,
      { new: true }
    );
    const redisData = await this.redisProvider.smembers(REDIS_KEY);
    redisData.map(item => {
      item = JSON.parse(item);
      if (item.uid === req.body.uid) {
        this.redisProvider.srem(REDIS_KEY, JSON.stringify(item));
        this.redisProvider.sadd(REDIS_KEY, JSON.stringify(data));
      }
    });
    return { code: 0, msg: "更新成功" };
  }

  public async delete(req) {
    checkUid(req.body.uid, "请传入Banner uid");

    await this.bannerRepo.deleteOne({ uid: req.body.uid });
    const redisData = await this.redisProvider.smembers(REDIS_KEY);
    redisData.map(item => {
      item = JSON.parse(item);
      if (item.uid === req.body.uid) {
        this.redisProvider.srem(REDIS_KEY, JSON.stringify(item));
      }
    });
    return { code: 0, msg: "删除成功" };
  }
}
