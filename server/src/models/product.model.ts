import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  stock: number;
  isActive: boolean;
  ratings: {
    average: number;
    count: number;
  };
  features: string[];
  ingredients: string[];
  howToUse: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String, required: true }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    features: [String],
    ingredients: [String],
    howToUse: { type: String },
  },
  { timestamps: true },
);

// Indexes
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
