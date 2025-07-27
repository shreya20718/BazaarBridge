import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  itemCount: { type: Number, default: 0 },
  deliveryTime: { type: String },
  tags: [String],
  address: { type: String, required: true }, // Simplified as a single string
  createdAt: { type: Date, default: Date.now }
});

const Store = mongoose.model("Store", storeSchema);
export default Store;