import express from "express";
import Collect from "@model/Collect";
import CollectService from "@service/CollectService";
const Router = express.Router();
const collectService = new CollectService(Collect);
Router.post("/add", async (req, res) => {
  try {
    const data = await collectService.add(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});
export default Router;
