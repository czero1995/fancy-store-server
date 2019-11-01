// import mongoose from './index'
import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema({
  uid: { type: Number, index: true, unique: true },
  title: { type: String, require: true },
  order: { type: Number, default: 1 },
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

export default mongoose.model("Category", CategorySchema);
