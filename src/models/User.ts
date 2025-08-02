import mongoose, { Schema, models, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Password is not always sent to the client
  role: 'customer' | 'vendor' | 'admin';
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // 'select: false' hides it by default
  role: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    default: 'customer',
  },
}, { timestamps: true });

export default models.User || mongoose.model<IUser>('User', UserSchema);