import express from "express";
import Admin from "@model/Admin";
import AdminService from "@service/AdminService";
const Router = express.Router();
const adminService = new AdminService(Admin);

Router.post("/register", async (req, res) => {
  try {
    const data = await adminService.register(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.get("/info", async (req: any, res) => {
  try {
    if (!req.session.admin) {
      return res.json({ code: 1, msg: "用户未登陆" });
    }
    const data = await adminService.info(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/update", async (req, res) => {
  try {
    const data = await adminService.update(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/delete", async (req, res) => {
  try {
    const data = await adminService.delete(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/login", async (req, res) => {
  try {
    const data = await adminService.login(req, res);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/logout", async (req, res) => {
  try {
    res.cookie("admin", "", { expires: new Date(0) });
    return res.json({ code: 0, msg: "已退出登录" });
  } catch (err) {
    return res.json(err);
  }
});

export default Router;
