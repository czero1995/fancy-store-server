import express from "express";
import Cart from "@model/Cart";
import Product from "@model/Product";
import CartService from "@service/CartService";
const Router = express.Router();
const cartService = new CartService(Cart, Product);

Router.post("/add", async (req, res) => {
  try {
    const data = await cartService.add(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});
Router.post("/cut", async (req, res) => {
  try {
    const data = await cartService.cut(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});
Router.post("/delete", async (req, res) => {
  try {
    const data = await cartService.delete(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.get("/all", async (req, res) => {
  try {
    const data = await cartService.all(req);
    return res.json({ code: 0, data });
  } catch (err) {
    return res.json(err);
  }
});

export default Router;
