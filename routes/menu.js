const express = require('express');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// GET /api/menu?category=Mains&veg=1&maxSpice=2&q=paneer&popular=1
router.get('/', async (req, res) => {
  try {
    const { category, veg, maxSpice, q, popular } = req.query;
    const filter = { available: true };

    if (category && category !== 'All') filter.category = category;
    if (veg === '1') filter.veg = true;
    if (popular === '1') filter.popular = true;
    if (maxSpice !== undefined && maxSpice !== '') filter.spice = { $lte: Number(maxSpice) };
    if (q) {
      const safe = String(q).slice(0, 40).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: safe, $options: 'i' };
    }

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Could not load the menu' });
  }
});

module.exports = router;
