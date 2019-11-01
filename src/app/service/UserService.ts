import UidHelper from "@helper/UidHelper";
import VerificationHelper from "@helper/VerificationHelper";
import { md5Pwd, checkUid, veifyField } from "@util/Util";
export default class UserService {
  protected userRepo: any;
  constructor(user) {
    this.userRepo = user;
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
      { uid: req.headers.userid },
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
      req.session.userName = isExist._id;
      const { user, avatar, uid } = isExist;
      return { code: 0, msg: "登录成功", data: { user, avatar, uid } };
    }
    return { code: -1, msg: "密码错误" };
  }

  public async info(req) {
    const data = await this.userRepo.findOne({ uid: req.headers.userid });
    return { code: 0, data };
  }
}
