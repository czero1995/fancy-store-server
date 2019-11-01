import express from "express";
import Banner from "@model/Banner";
import Redis from "@config/redis";
import BannerService from "@service/BannerService";
const Router = express.Router();
const bannerService = new BannerService(Banner, Redis);
Router.post("/add", async (req, res) => {
  try {
    const data = await bannerService.add(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.get("/all", async (req, res) => {
  try {
    const data = await bannerService.all();
    return res.json({ code: 0, data });
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/update", async (req, res) => {
  try {
    const data = await bannerService.update(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.get("/detail", async (req, res) => {
  try {
    const data = await bannerService.detail(req);
    return res.json({ code: 0, data });
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/delete", async (req, res) => {
  try {
    const data = await bannerService.delete(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

export default Router;
