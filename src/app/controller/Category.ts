import express from "express";
import Category from "@model/Category";
import Redis from "@config/redis";
import CategoryService from "@service/CategoryService";
const Router = express.Router();
const categoryService = new CategoryService(Category, Redis);
Router.post("/add", async (req, res) => {
  try {
    const data = await categoryService.add(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.get("/all", async (req, res) => {
  try {
    const data = await categoryService.all(req);
    return res.json({ code: 0, data });
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/update", async (req, res) => {
  try {
    const data = await categoryService.update(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.get("/detail", async (req, res) => {
  try {
    const data = await categoryService.detail(req);
    return res.json({ code: 0, data });
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/delete", async (req, res) => {
  try {
    const data = await categoryService.delete(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

export default Router;
