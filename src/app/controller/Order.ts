import express from "express";
import Order from "@model/Order";
import Product from "@model/Product";
import OrderService from "@service/OrderService";
const Router = express.Router();
const orderService = new OrderService(Order, Product);
Router.post("/add", async (req, res) => {
  try {
    const data = await orderService.add(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.get("/all", async (req, res) => {
  try {
    const data = await orderService.all(req);
    return res.json({ code: 0, data });
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/update", async (req, res) => {
  try {
    const data = await orderService.update(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/delete", async (req, res) => {
  try {
    const data = await orderService.delete(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

export default Router;
