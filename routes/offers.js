const express = require('express');
const Offer = require('../models/Offer');

const router = express.Router();

// All currently valid offers
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find({ active: true, validTill: { $gte: new Date() } })
      .sort({ discountPercent: -1 })
      .lean();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: 'Could not load offers' });
  }
});

// Check one coupon code (used by the order page)
router.get('/code/:code', async (req, res) => {
  try {
    const offer = await Offer.findOne({
      code: String(req.params.code).toUpperCase().trim(),
      active: true,
      validTill: { $gte: new Date() },
    }).lean();
    if (!offer) return res.status(404).json({ error: 'Invalid or expired coupon code' });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: 'Could not check the coupon' });
  }
});

module.exports = router;
