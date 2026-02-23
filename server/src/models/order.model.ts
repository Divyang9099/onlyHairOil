import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  pricing: {
    subtotal: number;
    shippingFee: number;
    discount: number;
    tax: number;
    total: number;
  };
  payment: {
    method: 'online' | 'cod';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking?: {
    carrier?: string;
    number?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    pricing: {
      subtotal: { type: Number, required: true },
      shippingFee: { type: Number, required: true, default: 0 },
      discount: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    payment: {
      method: { type: String, enum: ['online', 'cod'], required: true },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
      },
      transactionId: { type: String },
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    tracking: {
      carrier: String,
      number: String,
    },
  },
  { timestamps: true },
);

// Indexes
orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
