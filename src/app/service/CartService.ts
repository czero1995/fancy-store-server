import UidHelper from "@helper/UidHelper";
import VerificationHelper from "@helper/VerificationHelper";
import { decrypt, veifyField } from "@util/Util";
export default class CartService {
  protected cartRepo: any;
  protected productRepo: any;
  constructor(cart, product) {
    this.cartRepo = cart;
    this.productRepo = product;
  }
  public async add(req) {
    const paramsInfo = req.body;
    checkProductId(paramsInfo);
    const userId = decrypt(req.headers.sessionid);
    const isExist = await this.cartRepo.findOne({
      productId: paramsInfo.productId,
      userId
    });
    if (isExist) {
      isExist.num = isExist.num + 1;
      await isExist.save();
      return { code: 0, msg: "添加成功" };
    }
    paramsInfo.uid = await UidHelper("Cart");
    paramsInfo.userId = userId;
    paramsInfo.productId = req.body.productId;
    paramsInfo.created = Date.now();
    paramsInfo.updated = Date.now();
    const model = await new this.cartRepo(paramsInfo);
    await model.save();
    return { code: 0, msg: "添加成功" };
  }

  public async cut(req) {
    const paramsInfo = req.body;
    checkProductId(paramsInfo);
    const userId = decrypt(req.headers.sessionid);
    const isExist = await this.cartRepo.findOne({
      productId: paramsInfo.productId,
      userId
    });
    if (isExist.num > 1) {
      isExist.num = isExist.num - 1;
      isExist.save();
      return { code: 0, msg: "减少成功" };
    }
  }

  public async delete(req) {
    const paramsInfo = req.body;
    const userId = decrypt(req.headers.sessionid);
    checkProductId(paramsInfo);
    await this.cartRepo.remove({
      productId: paramsInfo.productId,
      userId
    });
    return { code: 0, msg: "删除成功" };
  }

  public async all(req) {
    const data = await this.cartRepo.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "uid",
          as: "productItems"
        }
      },
      {
        $match: { userId: decrypt(req.headers.sessionid) }
      }
    ]);
    data.map(item => {
      item.productItems = item.productItems[0];
    });
    return data;
  }
}
function checkProductId(paramsInfo) {
  const verifyObject = {
    productId: VerificationHelper.isNonEmpty(
      paramsInfo.productId,
      "请传入productId"
    )
  };
  veifyField(verifyObject);
}
