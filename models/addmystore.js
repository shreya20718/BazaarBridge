import mongoose from "mongoose";

const AddMyStoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  address: { type: String, required: true },
  description: { type: String },
  deliveryTime: { type: String },
  deliveryOptions: [{ type: String }],
  categories: [{ type: String }],
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  createdAt: { type: Date, default: Date.now }
});

const AddMyStore = mongoose.model("AddMyStore", AddMyStoreSchema);
export default AddMyStore;