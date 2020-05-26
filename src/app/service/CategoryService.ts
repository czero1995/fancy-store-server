import UidHelper from "@helper/UidHelper";
import RedisProvider from "@middleware/RedisProvider";
import VerificationHelper from "@helper/VerificationHelper";
import { checkUid, veifyField } from "@util/Util";
import config from "@config/config";
const REDIS_KEY = `${config.REDIS_PRODECT_PREFIX}:category`;
export default class CategoryService {
  protected categoryRepo: any;
  protected redisProvider: any;
  constructor(category, redis) {
    this.categoryRepo = category;
    this.redisProvider = new RedisProvider(redis);
  }
  public async add(req: any) {
    const paramsInfo = req.body;
    const verifyObject = {
      title: VerificationHelper.isNonEmpty(paramsInfo.title, "请传入分类名字")
    };
    veifyField(verifyObject);

    const isExist = await this.categoryRepo.findOne({
      title: paramsInfo.title
    });
    if (isExist) {
      return { code: -1, msg: "分类已存在" };
    }

    paramsInfo.uid = await UidHelper("Category");
    paramsInfo.created = Date.now();
    paramsInfo.updated = Date.now();
    const model = await new this.categoryRepo(paramsInfo);
    const data = await model.save();
    await this.redisProvider.sadd(REDIS_KEY, JSON.stringify(data));
    await this.redisProvider.expire(REDIS_KEY, 3600);

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

    data = await this.categoryRepo.find(query).sort({ order: -1 });
    data.map(item => {
      this.redisProvider.zadd(REDIS_KEY, JSON.stringify(item));
    });
    await this.redisProvider.expire(REDIS_KEY, 3600);
    return data;
  }

  public async update(req) {
    checkUid(req.body.uid, "请传入分类uid");
    req.body.params.updated = Date.now();
    const data = await this.categoryRepo.findOneAndUpdate(
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

  public async detail(req): Promise<any> {
    checkUid(req.query.uid, "请传入分类 uid");

    const data = await this.categoryRepo.findOne({ uid: req.query.uid });
    return data;
  }

  public async delete(req) {
    checkUid(req.body.uid, "请传入分类uid");

    await this.categoryRepo.deleteOne({ uid: req.body.uid });

    return { code: 0, msg: "删除成功" };
  }
}
