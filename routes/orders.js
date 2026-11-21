const express = require('express');
const MenuItem = require('../models/MenuItem');
const Offer = require('../models/Offer');
const Order = require('../models/Order');
const { getUserId } = require('./auth');

const router = express.Router();

const FREE_DELIVERY_ABOVE = 500;
const DELIVERY_FEE = 40;

// POST /api/orders
// body: { customerName, phone, address, payment, coupon, items: [{ id, qty }] }
// Prices are always read from the database, never trusted from the browser.
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, address, payment = 'COD', coupon = '', items } = req.body || {};

    if (!customerName || !phone || !address) {
      return res.status(400).json({ error: 'Please fill in your name, phone and address' });
    }
    if (!/^[0-9+\-\s]{8,15}$/.test(String(phone))) {
      return res.status(400).json({ error: 'Please enter a valid phone number' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty' });
    }
    if (!['COD', 'UPI'].includes(payment)) {
      return res.status(400).json({ error: 'Invalid payment option' });
    }

    const ids = items.map((i) => i.id);
    const menu = await MenuItem.find({ _id: { $in: ids }, available: true }).lean();

    const lines = [];
    for (const it of items) {
      const dish = menu.find((m) => String(m._id) === String(it.id));
      if (!dish) return res.status(400).json({ error: 'One of the dishes is no longer available' });
      const qty = Math.max(1, Math.min(20, parseInt(it.qty, 10) || 1));
      lines.push({ menuItem: dish._id, name: dish.name, price: dish.price, qty });
    }

    const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);

    let discount = 0;
    let usedCoupon = '';
    if (coupon) {
      const offer = await Offer.findOne({
        code: String(coupon).toUpperCase().trim(),
        active: true,
        validTill: { $gte: new Date() },
      }).lean();
      if (!offer) return res.status(400).json({ error: 'Invalid or expired coupon code' });
      if (subtotal < offer.minOrder) {
        return res.status(400).json({ error: `This coupon needs a minimum order of ₹${offer.minOrder}` });
      }
      discount = Math.round((subtotal * offer.discountPercent) / 100);
      if (offer.maxDiscount > 0) discount = Math.min(discount, offer.maxDiscount);
      usedCoupon = offer.code;
    }

    const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
    const total = subtotal - discount + deliveryFee;

    const order = await Order.create({
      user: getUserId(req) || undefined,
      customerName: String(customerName).trim().slice(0, 80),
      phone: String(phone).trim(),
      address: String(address).trim().slice(0, 300),
      items: lines,
      subtotal,
      discount,
      deliveryFee,
      total,
      coupon: usedCoupon,
      payment,
    });

    res.status(201).json({ orderId: order._id, total, discount, deliveryFee });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid item in cart' });
    console.error(err);
    res.status(500).json({ error: 'Could not place your order. Please try again.' });
  }
});

// GET /api/orders/:id  (simple order status lookup)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ status: order.status, total: order.total, items: order.items });
  } catch (err) {
    res.status(400).json({ error: 'Invalid order id' });
  }
});

module.exports = router;
