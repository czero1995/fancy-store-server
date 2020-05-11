import UidHelper from "@helper/UidHelper";
import VerificationHelper from "@helper/VerificationHelper";
import { checkUid, veifyField, decrypt } from "@util/Util";

export default class AddressService {
  protected addressRepo: any;
  constructor(address) {
    this.addressRepo = address;
  }
  public async add(req): Promise<object> {
    const paramsInfo = req.body;
    const verifyObject = {
      name: VerificationHelper.isNonEmpty(paramsInfo.name, "请输入用户名字"),
      tel: VerificationHelper.isMobile(paramsInfo.tel, "请输入的电话号码"),
      address: VerificationHelper.isNonEmpty(paramsInfo.address, "请输入地址"),
      detailAddress: VerificationHelper.isNonEmpty(
        paramsInfo.detailAddress,
        "请输入详细地址"
      )
    };
    veifyField(verifyObject);

    paramsInfo.uid = await UidHelper("address");
    paramsInfo.userId = decrypt(req.headers.sessionid);
    paramsInfo.created = Date.now();
    paramsInfo.updated = Date.now();
    const model = await new this.addressRepo(paramsInfo);
    await model.save();
    if (paramsInfo.isDefault) {
      const data = await this.addressRepo.findOne({
        userid: decrypt(req.headers.sessionid),
        isDefault: false
      });
      if (data) {
        data.isDefault = false;
        await data.save();
      }
    }
    return { code: 0, msg: "添加成功" };
  }

  public async all(req) {
    return await this.addressRepo.find({
      userId: decrypt(req.headers.sessionid)
    });
  }

  public async update(req) {
    checkUid(req.body.uid, "请传入地址uid");
    const paramsInfo = req.body;
    paramsInfo.updated = Date.now();
    await this.addressRepo.findOneAndUpdate(
      { uid: req.body.uid },
      req.body.params,
      { new: true }
    );
    return { code: 0, msg: "更新成功" };
  }
  public async delete(req) {
    checkUid(req.body.uid, "请传入地址uid");

    await this.addressRepo.deleteOne({ uid: req.body.uid });
    return { code: 0, msg: "删除成功" };
  }
}
