// import mongoose from './index'
import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  uid: { type: Number, index: true, unique: true },
  userId: { type: String, required: true },
  productId: { type: Number },
  isChoice: { type: Boolean, default: false },
  num: { type: Number, default: 1 },
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

export default mongoose.model("Cart", CartSchema);
