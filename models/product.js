import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true }, // kg, ltr, piece, etc.
  minQuantity: { type: Number, default: 1 },
  maxQuantity: { type: Number, default: 1000 },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  images: [String],
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 100 },
  tags: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  createdAt: { type: Date, default: Date.now }
});

const Product=mongoose.model("Product",productSchema);
export default Product;
