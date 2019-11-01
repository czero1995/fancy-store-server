import express from "express";
import Address from "@model/Address";
import AddressService from "@service/AddressService";
const Router = express.Router();
const addressService = new AddressService(Address);

Router.post("/add", async (req, res) => {
  try {
    const data = await addressService.add(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.get("/all", async (req, res) => {
  try {
    const data = await addressService.all(req);
    return res.json({ code: 0, data });
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/update", async (req, res) => {
  try {
    const data = await addressService.update(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

Router.post("/delete", async (req, res) => {
  try {
    const data = await addressService.delete(req);
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
});

export default Router;
