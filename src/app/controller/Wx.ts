import express from "express";
import config from "@config/config";
import User from "@model/User";
import WxService from "@service/WxService";
const Router = express.Router();
import Redis from "@config/redis";
import sha1 from "sha1";
const wxService = new WxService(User, Redis);

Router.get("checkSignature", async (req, res) => {
  try {
    const signature = req.query.signature;
    const timestamp = req.query.timestamp;
    const nonce = req.query.nonce;
    const token = config.wx.signatureToken;
    const echostr = req.query.echostr;
    const str = [token, timestamp, nonce].sort().join("");
    const sha1Str = sha1(str);
    if (sha1Str === signature) {
      return res.send(echostr);
    } else {
      return res.send("wrong");
    }
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/applet/login", async (req, res) => {
  try {
    const data = await wxService.appletLogin(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

export default Router;
