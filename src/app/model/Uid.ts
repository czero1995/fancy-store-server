// import mongoose from './index'
import mongoose from "mongoose";

const UIDSchema = new mongoose.Schema({
  name: { type: String },
  uid: { type: Number }
});

export default mongoose.model("Uid", UIDSchema);
