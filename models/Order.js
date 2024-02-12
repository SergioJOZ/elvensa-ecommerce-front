import { mongooseConnect } from "@/lib/mongoose";
import mongoose, {model, Schema, models} from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence'
const OrderSchema = new Schema({
  productsToOrder: {type: Array, required: true},
  userId: {type: mongoose.Types.ObjectId, ref: "User", required: true},
  status: {type: String, default: 'No procesada'},
  deliveryType: {type: String},
  paymentType: {type: String},
  total: {type: Number},
  payment: [{type: String}]
}, {
  timestamps: true,
});

const connection = await mongoose.createConnection(process.env.MONGODB_URI)
const AutoIncrement = AutoIncrementFactory(connection)

OrderSchema.plugin(AutoIncrement, {id: 'orderId',inc_field: 'orderId'})

export const Order = models.Order || model('Order', OrderSchema);