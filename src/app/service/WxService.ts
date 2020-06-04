import config from "@config/config";
import UidHelper from "@helper/UidHelper";
import axios from "axios";
import RedisProvider from "@middleware/RedisProvider";
import { encrypt } from "@util/Util";
const REDIS_KEY = `${config.REDIS_PRODECT_PREFIX}:sessionId`;
export default class WxService {
  protected userRepo: any;
  protected redisProvider: any;
  constructor(user, redis) {
    this.userRepo = user;
    this.redisProvider = new RedisProvider(redis);
  }
  public async appletLogin(req) {
    const body = req.body;
    const res = await axios.get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${config.wx.APPID}&secret=${config.wx.SECRET}&js_code=${body.code}&grant_type=authorization_code`
    );
    console.log("res: ", res);
    if (res.status === 200) {
      const userInfo = body.userInfo;
      const paramInfo: any = {};
      const wxAppletOpenId = res.data.openid;
      const wxUnionID = res.data.unionid;
      const sessionKey = res.data.session_key;
      paramInfo.sessionKey = sessionKey;
      userInfo.gender && (paramInfo.gender = userInfo.gender);
      userInfo.avatarUrl && (paramInfo.avatarUrl = userInfo.avatarUrl);
      paramInfo.nickName = userInfo.nickName;
      paramInfo.updated = new Date();
      let openIdToUserInfo = await this.userRepo.findOne({ wxAppletOpenId });
      if (openIdToUserInfo) {
        console.log("数据库有openId");
        if (!openIdToUserInfo.wxUnionID && wxUnionID) {
          paramInfo.wxUnionID = wxUnionID;
          openIdToUserInfo = await this.userRepo.findOneAndUpdate(
            { wxAppletOpenId },
            paramInfo,
            { new: true }
          );
        }
        openIdToUserInfo = openIdToUserInfo.toObject();
        openIdToUserInfo.sessionId = this.setLoginSession(openIdToUserInfo.uid);
        return openIdToUserInfo;
      }
      if (wxUnionID) {
        console.log("数据库有unionId");
        const wxUnionIdToUserInfo = await this.userRepo.findOne({ wxUnionID });
        if (wxUnionIdToUserInfo) {
          paramInfo.wxAppletOpenId = wxAppletOpenId;
          paramInfo.sessionId = this.setLoginSession(paramInfo.uid);
          return this.userRepo.findOneAndUpdate({ wxUnionID }, paramInfo, {
            new: true
          });
        }
      }

      console.log("添加新用户");
      paramInfo.wxAppletOpenId = wxAppletOpenId;
      paramInfo.wxUnionID = wxUnionID;
      paramInfo.created = new Date();
      paramInfo.uid = await UidHelper("User");
      const model = await new this.userRepo(paramInfo);
      await model.save();
      paramInfo.sessionId = this.setLoginSession(paramInfo.uid);
      return paramInfo;
    }
  }

  private setLoginSession(sessionKey) {
    const sessionID = encrypt(sessionKey + "");
    this.redisProvider.set(
      REDIS_KEY + sessionID,
      sessionKey.toString(),
      false,
      10000
    );
    return sessionID;
  }

  public async webLogin(req) {
    const paramInfo: any = {};
    const code = req.query.code;
    const res = await axios.get(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.wxWeb.APPID}&secret=${config.wxWeb.SECRET}&code=${code}&grant_type=authorization_code`
    );
    console.log("res:data ", res.data);
    let access_token = res.data.access_token;
    let wxWebOpenId = res.data.openid;
    const data = await axios.get(
      `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${wxWebOpenId}`
    );
    const wxUnionID = data.data.unionid;
    console.log("data: ", data.data);

    if (wxWebOpenId) {
      let openIdToUserInfo = await this.userRepo.findOne({ wxWebOpenId });
      if (openIdToUserInfo) {
        console.log("数据库有webOpenId");
        if (!openIdToUserInfo.wxUnionID && wxUnionID) {
          paramInfo.wxUnionID = wxUnionID;
          openIdToUserInfo = await this.userRepo.findOneAndUpdate(
            { wxWebOpenId },
            paramInfo,
            { new: true }
          );
        }
      }

      if (wxUnionID) {
        console.log("数据库有unionId");
        const wxUnionIdToUserInfo = await this.userRepo.findOne({ wxUnionID });
        if (wxUnionIdToUserInfo) {
          paramInfo.wxWebOpenId = wxWebOpenId;
          paramInfo.sessionId = this.setLoginSession(paramInfo.uid);
          return this.userRepo.findOneAndUpdate({ wxUnionID }, paramInfo, {
            new: true
          });
        }
      }

      console.log("添加新用户");
      paramInfo.wxWebOpenId = wxWebOpenId;
      paramInfo.wxUnionID = wxUnionID;
      paramInfo.created = new Date();
      paramInfo.uid = await UidHelper("User");
      const model = await new this.userRepo(paramInfo);
      await model.save();
      paramInfo.sessionId = this.setLoginSession(paramInfo.uid);
      return paramInfo;
    }
  }
}
