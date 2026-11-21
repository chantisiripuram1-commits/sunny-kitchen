const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountPercent: { type: Number, required: true, min: 1, max: 100 },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 }, // 0 = no cap
  validTill: { type: Date, required: true },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model('Offer', offerSchema);
