import express from "express";
import User from "@model/User";
import WxService from "@service/WxService";
const Router = express.Router();
const wxService = new WxService(User);
Router.post("/applet/login", async (req, res) => {
  try {
    const data = await wxService.appletLogin(req.body);
    console.log("wxdata", data);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

export default Router;
