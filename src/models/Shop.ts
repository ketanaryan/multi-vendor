import mongoose, { Schema, models, Document } from 'mongoose';

export interface IShop extends Document {
  owner: mongoose.Schema.Types.ObjectId;
  name: string;
  address: string;
  city: string;
  category: string;
  image?: string;
  status: 'pending' | 'approved' | 'blocked';
}

const ShopSchema: Schema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true, index: true },
  category: { type: String, required: true },
  image: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'blocked'],
    default: 'pending',
  },
}, { timestamps: true });

export default models.Shop || mongoose.model<IShop>('Shop', ShopSchema);