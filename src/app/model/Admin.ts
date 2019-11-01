// import mongoose from './index'
import mongoose from "mongoose";
const AdminSchema = new mongoose.Schema({
  uid: { type: Number, index: true, unique: true },
  admin: { type: String, require: true },
  pwd: { type: String, require: true },
  avatar: { type: String },
  roles: { type: Array },
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

export default mongoose.model("Admin", AdminSchema);
