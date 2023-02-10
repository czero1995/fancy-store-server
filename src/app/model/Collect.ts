// import mongoose from './index'
import mongoose from "mongoose";
const CollectSchema = new mongoose.Schema({
  uid: { type: Number, index: true, unique: true },
  title: { type: String }, // 标题
  content: { type: String }, // 内容
  type: { type: String, required: true }, // chat: chatgpt
  order: { type: Number, default: 1 },
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

export default mongoose.model("Collect", CollectSchema);
