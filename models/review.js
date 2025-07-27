import mongoose from "mongoose";

// Review Schema
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Optional
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Optional
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  category: { type: String, default: 'general' }, // product_quality, safety, general
  images: [String],
  createdAt: { type: Date, default: Date.now }
});

const Review=mongoose.model("Review",reviewSchema);
export default Review;