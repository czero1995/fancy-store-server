// import mongoose from './index'
import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  uid: { type: Number, index: true, unique: true },
  user: { type: String, require: true },
  pwd: { type: String, require: true },
  avatar: { type: String, default: "" },
  sex: { type: String },
  carts: { type: Array },
  order: { type: Array },
  address: { type: Array },
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

export default mongoose.model("User", UserSchema);
