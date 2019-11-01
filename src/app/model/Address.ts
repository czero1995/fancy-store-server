// import mongoose from './index'
import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  uid: { type: Number, index: true, unique: true },
  userId: { type: Number, index: true },
  name: { type: String, required: true },
  tel: { type: Number, required: true },
  post: { type: Number },
  address: { type: String, required: true },
  detailAddress: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

export default mongoose.model("Address", AddressSchema);
