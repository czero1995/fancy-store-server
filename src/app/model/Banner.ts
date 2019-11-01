// import mongoose from './index'
import mongoose from "mongoose";
const BannerSchema = new mongoose.Schema({
  uid: { type: Number, index: true, unique: true },
  title: { type: String },
  img: { type: String },
  url: { type: String },
  order: { type: Number, default: 1 },
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

export default mongoose.model("Banner", BannerSchema);
