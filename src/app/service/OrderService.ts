import UidHelper from "@helper/UidHelper";
import VerificationHelper from "@helper/VerificationHelper";
import { checkUid, veifyField } from "@util/Util";
export default class OrderService {
  protected orderRepo: any;
  protected productRepo: any;
  constructor(order, product) {
    this.orderRepo = order;
    this.productRepo = product;
  }
  public async add(req: any) {
    const paramsInfo = req.body;
    const verifyObject = {
      productIds: VerificationHelper.checkArrayNotEmpty(
        paramsInfo.productIds,
        "请传入productId"
      ),
      address: VerificationHelper.isNonEmpty(
        paramsInfo.address,
        "地址信息不可为空"
      )
    };
    veifyField(verifyObject);
    paramsInfo.uid = await UidHelper("Order");
    paramsInfo.userId = req.headers.userid;
    paramsInfo.productIds = paramsInfo.productIds;
    paramsInfo.created = Date.now();
    paramsInfo.updated = Date.now();
    const model = await new this.orderRepo(paramsInfo);
    await model.save();
    return { code: 0, msg: "添加成功" };
  }

  public async all(req) {
    const queryParams: any = {
      userId: req.headers.userid
    };
    req.query.status && (queryParams.status = req.query.status);

    const data = await this.orderRepo
      .find(queryParams)
      .sort({ uid: -1 })
      .lean(true);
    for (let i = 0; i < data.length, i++; ) {
      const res = await this.productRepo
        .find(
          {
            uid: {
              $in: data[i].productIds.map(itemSecond => itemSecond.uid)
            }
          },
          { detailInfo: 0 }
        )
        .lean(true);
      data[i].productIds.map((itemSecond, indexSecond) => {
        res[indexSecond].num = itemSecond.num;
      });
      data[i].productItems = res;
    }

    return data;
  }

  public async update(req) {
    checkUid(req.body.uid, "请传入用户uid");
    await this.orderRepo.findOneAndUpdate(
      { uid: req.body.uid },
      req.body.params,
      { new: true }
    );
    return { code: 0, msg: "更新成功" };
  }

  public async delete(req) {
    checkUid(req.body.uid, "请传入订单uid");
    await this.orderRepo.deleteOne({ uid: req.body.uid });
    return { code: 0, msg: "删除成功" };
  }
}
