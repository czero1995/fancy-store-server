import UidHelper from "@helper/UidHelper";
import RedisProvider from "@middleware/RedisProvider";
import VerificationHelper from "@helper/VerificationHelper";
import { checkUid, veifyField } from "@util/Util";
const REDIS_KEY = "product";
export default class ProductService {
  protected productRepo: any;
  constructor(product) {
    this.productRepo = product;
  }
  public async add(req) {
    const paramsInfo = req.body;
    const verifyObject = {
      title: VerificationHelper.isNonEmpty(paramsInfo.title, "请传入商品标题"),
      priceNow: VerificationHelper.isNonEmpty(
        paramsInfo.priceNow,
        "请传入商品价格"
      )
    };
    veifyField(verifyObject);

    const isExist = await this.productRepo.findOne({
      title: paramsInfo.title
    });
    if (isExist) {
      return { code: -1, msg: "产品已存在" };
    }

    paramsInfo.uid = await UidHelper("product");
    paramsInfo.created = Date.now();
    paramsInfo.updated = Date.now();
    const model = await new this.productRepo(paramsInfo);
    await model.save();
    return { code: 0, msg: "添加成功" };
  }

  public async all(req): Promise<any[]> {
    const pageNum = parseInt(req.query.pageNum, 10) || 0;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const queruParam: any = {};
    queruParam.categoryUid = req.query.categoryUid;

    return await this.productRepo
      .find(queruParam, { detailInfo: 0 })
      .skip(pageNum * pageSize)
      .limit(pageSize)
      .sort({ _id: -1 });
  }

  public async detail(req): Promise<any> {
    checkUid(req.query.uid, "请传入商品 uid");

    // let data = await RedisProvider.get(RedisProvider.getKey(REDIS_KEY, req.query.id))
    // if (data) {
    //   return data
    // }

    const data = await this.productRepo.findOne({ uid: req.query.uid });
    // await RedisProvider.set(RedisProvider.getKey(REDIS_KEY, req.query.uid), data)
    return data;
  }

  public async update(req): Promise<object> {
    checkUid(req.body.uid, "请传入商品 uid");

    await this.productRepo.findOneAndUpdate(
      { uid: req.body.uid },
      req.body.params,
      { new: true }
    );
    // await RedisProvider.del(RedisProvider.getKey(REDIS_KEY, req.body.id))
    return { code: 0, msg: "更新成功" };
  }

  public async delete(req): Promise<object> {
    checkUid(req.body.uid, "请传入商品 uid");

    await this.productRepo.deleteOne({ uid: req.body.uid });
    // RedisProvider.del(RedisProvider.getKey(REDIS_KEY, req.body.uid))
    return { code: 0, msg: "删除成功" };
  }
}
