import express from "express";
import User from "@model/User";
import UserService from "@service/UserService";
const Router = express.Router();
import Redis from "@config/redis";
const userService = new UserService(User, Redis);
Router.post("/register", async (req, res) => {
  try {
    const data = await userService.register(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/update", async (req, res) => {
  try {
    const data = await userService.update(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/login", async (req, res) => {
  try {
    const data = await userService.login(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/logout", async (req: any, res) => {
  try {
    req.session.userName = null;
    return res.json({ code: 0, msg: "已退出登录" });
  } catch (err) {
    return res.json(err);
  }
});

Router.get("/info", async (req: any, res) => {
  try {
    const data = await userService.info(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

export default Router;
