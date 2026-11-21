
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },

  category: {
    type: String,
    required: true,
    enum: [
      'Starters',
      'Mains',
      'Biryani',
      'Breads',
      'Desserts',
      'Drinks',
      'Chinese'
    ],
  },

  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  veg: { type: Boolean, default: true },
  spice: { type: Number, min: 0, max: 3, default: 1 },
  emoji: { type: String, default: '🍛' },
  popular: { type: Boolean, default: false },
  available: { type: Boolean, default: true },

  // Stores the food image URL
  image: { type: String, default: '' },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
