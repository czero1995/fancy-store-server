import express from "express";
import Product from "@model/Product";
import ProductService from "@service/ProductService";
const Router = express.Router();
const productService = new ProductService(Product);

Router.post("/add", async (req, res) => {
  try {
    const data = await productService.add(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.get("/all", async (req, res) => {
  try {
    const data = await productService.all(req);
    return res.json({ code: 0, data });
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/update", async (req, res) => {
  try {
    const data = await productService.update(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.get("/detail", async (req, res) => {
  try {
    const data = await productService.detail(req);
    return res.json({ code: 0, data });
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/delete", async (req, res) => {
  try {
    const data = await productService.delete(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});
export default Router;
