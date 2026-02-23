import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password?: string;
  role: 'user' | 'admin' | 'superadmin';
  isVerified: boolean;
  avatar?: string;
  addresses: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    avatar: { type: String },
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true },
);

// Indexes
userSchema.index({ mobile: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
