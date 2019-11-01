// import mongoose from './index'
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  uid: { type: Number, index: true, unique: true },
  userId: { type: String, index: true },
  productIds: [
    {
      uid: { type: Number },
      num: { type: Number }
    }
  ],
  address: { type: Object, required: true },
  status: { type: String, default: "paying" }, // payed,done
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

export default mongoose.model("Order", OrderSchema);
