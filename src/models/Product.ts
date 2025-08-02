import mongoose, { Schema, models, Document } from 'mongoose';

export interface IProduct extends Document {
  shop: mongoose.Schema.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const ProductSchema: Schema = new Schema({
  shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  image: { type: String },
}, { timestamps: true });

export default models.Product || mongoose.model<IProduct>('Product', ProductSchema);