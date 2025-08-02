import mongoose, { Schema, models, Document } from 'mongoose';

export interface IOrder extends Document {
    customer: mongoose.Schema.Types.ObjectId;
    product: mongoose.Schema.Types.ObjectId;
    shop: mongoose.Schema.Types.ObjectId;
    status: string;
    orderType: 'online' | 'visit';
}

const OrderSchema: Schema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  status: { type: String, default: 'Pending' },
  orderType: { type: String, enum: ['online', 'visit'], required: true },
}, { timestamps: true });

export default models.Order || mongoose.model<IOrder>('Order', OrderSchema);