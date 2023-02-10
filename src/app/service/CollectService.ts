import UidHelper from "@helper/UidHelper";
import VerificationHelper from "@helper/VerificationHelper";
import { veifyField } from "@util/Util";
import config from "@config/config";
const REDIS_KEY = `${config.REDIS_PRODECT_PREFIX}:banner`;

export default class CollectService {
  protected collectRepo: any;
  constructor(collect) {
    this.collectRepo = collect;
  }
  public async add(req): Promise<object> {
    let paramsInfo = req.body;
    const isExist = await this.collectRepo.findOne({
      title: paramsInfo.title
    });
    paramsInfo.uid = await UidHelper("Banner");
    if (isExist) {
      paramsInfo.title = `${paramsInfo.title} - ${paramsInfo.uid}`;
    }

    paramsInfo.created = Date.now();
    paramsInfo.updated = Date.now();
    const model = new this.collectRepo(paramsInfo);
    const data = await model.save();
    return { code: 0, data };
  }
}
