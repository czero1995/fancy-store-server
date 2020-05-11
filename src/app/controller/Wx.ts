import express from "express";
import User from "@model/User";
import WxService from "@service/WxService";
const Router = express.Router();
import Redis from "@config/redis";
const wxService = new WxService(User, Redis);
Router.post("/applet/login", async (req, res) => {
  try {
    const data = await wxService.appletLogin(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

export default Router;
