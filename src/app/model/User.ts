// import mongoose from './index'
import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  uid: { type: Number, index: true, unique: true },
  nickName: { type: String },
  user: { type: String, require: true },
  pwd: { type: String, require: true },
  avatarUrl: { type: String, default: "" },
  gender: { type: Number },
  carts: { type: Array },
  order: { type: Array },
  address: { type: Array },
  wxUnionID: { type: String },
  wxAppletOpenId: { type: String },
  wxWebOpenId: { type: String },
  session_key: { type: String },
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

export default mongoose.model("User", UserSchema);
