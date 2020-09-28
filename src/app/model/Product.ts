// import mongoose from './index'
import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
  uid: { type: Number, index: true, unique: true },
  title: { type: String, required: true },
  detailInfo: { type: Object },
  priceNow: { type: Number, required: true },
  priceOrigin: { type: Number },
  imgCover: { type: String },
  category: { type: String },
  categoryUid: { type: Number },
  order: { type: Number, default: 1 },
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

export default mongoose.model("Product", ProductSchema);
