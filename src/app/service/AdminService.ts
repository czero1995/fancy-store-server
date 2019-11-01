import UidHelper from "@helper/UidHelper";
import VerificationHelper from "@helper/VerificationHelper";
import { md5Pwd, checkUid, veifyField } from "@util/Util";
export default class AdminService {
  protected adminRepo: any;
  constructor(admin) {
    this.adminRepo = admin;
  }
  public async register(req) {
    const paramsInfo = req.body;
    const verifyObject = {
      admin: VerificationHelper.isNonEmpty(
        paramsInfo.admin,
        "请输入管理员用户名"
      ),
      pwd: VerificationHelper.isNonEmpty(paramsInfo.pwd, "请输入密码")
    };
    veifyField(verifyObject);

    const isExist = await this.adminRepo.findOne({
      admin: paramsInfo.admin
    });
    if (isExist) {
      return { code: -1, msg: "管理员已存在" };
    }

    paramsInfo.uid = await UidHelper("Admin");
    paramsInfo.pwd = md5Pwd(paramsInfo.pwd);
    paramsInfo.roles = [2];
    paramsInfo.created = Date.now();
    paramsInfo.updated = Date.now();
    const model = await new this.adminRepo(paramsInfo);
    model.save();
    return { code: 0, msg: "添加成功" };
  }

  public async update(req) {
    checkUid(req.body.uid, "请传入admin uid");
    const paramsInfo = req.body;
    paramsInfo.updated = Date.now();
    await this.adminRepo.findOneAndUpdate(
      { uid: req.body.uid },
      req.body.params,
      { new: true }
    );
    return { code: 0, msg: "更新成功" };
  }

  public async info(req) {
    const data = await this.adminRepo.findById({ _id: req.session.admin });
    return { code: 0, data };
  }

  public async delete(req) {
    checkUid(req.body.uid, "请传入admin uid");
    await this.adminRepo.deleteOne({ uid: req.body.uid });
    return { code: 0, msg: "删除成功" };
  }

  public async login(req, res) {
    const paramsInfo = req.body;
    const isExist = await this.adminRepo.findOne({
      admin: paramsInfo.admin
    });
    if (!isExist) {
      return { code: -1, msg: "管理员不存在" };
    }

    if (md5Pwd(paramsInfo.pwd) === isExist.pwd) {
      req.session.admin = isExist._id;
      res.cookie("admin", isExist._id, {
        maxAge: 60 * 100000
      });
      return { code: 0, msg: "登录成功" };
    }

    return { code: -1, msg: "密码错误" };
  }
}
