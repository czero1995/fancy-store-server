import config from "@config/config";
import UidHelper from "@helper/UidHelper";
import axios from "axios";
const cloud = require("wx-server-sdk");
export default class WxService {
  protected userRepo: any;
  constructor(user) {
    this.userRepo = user;
  }
  public async appletLogin(body) {
    const res = await axios.get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${config.wx.APPID}&secret=${config.wx.SECRET}&js_code=${body.code}&grant_type=authorization_code`
    );
    console.log("res", res.data);
    if (res.status === 200) {
      console.log("获取code2session成功");
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
        return openIdToUserInfo;
      }
      if (wxUnionID) {
        console.log("数据库有unionId");
        const wxUnionIdToUserInfo = await this.userRepo.findOne({ wxUnionID });
        if (wxUnionIdToUserInfo) {
          paramInfo.wxAppletOpenId = wxAppletOpenId;
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
      return paramInfo;
    }
  }
}
