import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  registrationId: {
    type: String,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  gstNumber: {
    type: String,
    required: true,
    match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  },
  panNumber: {
    type: String,
    required: true,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  },
  aadhaarNumber: {
    type: String,
    required: true,
    match: /^\d{4}\s\d{4}\s\d{4}$/
  },
  contactNumber: {
    type: String,
    required: true,
    match: /^(\+91[\-\s]?)?[0-9]{10}$/
  },
  emailAddress: {
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  businessAddress: {
    type: String,
    required: true
  },
  pickupAddress: {
    type: String
  },
  accountHolderName: {
    type: String,
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    match: /^[0-9]{9,18}$/
  },
  ifscCode: {
    type: String,
    required: true,
    match: /^[A-Z]{4}0[A-Z0-9]{6}$/
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to generate registrationId
supplierSchema.pre('save', function (next) {
  if (!this.registrationId) {
    this.registrationId = 'SUP' + Date.now();
  }
  next();
});

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;
