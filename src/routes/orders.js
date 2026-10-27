const express = require('express');
const db = require('../database/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const notFound = (res) => res.status(404).json({ error: { name: 'notFound', message: 'Order not found' } });

router.get('/', (req, res) => {
  res.json({ orders: db.listOrders(req.user.tenantId) });
});

router.get('/:id', (req, res) => {
  const order = db.getOrder(req.params.id);
  if (!order) return notFound(res);
  res.json({ order });
});

router.post('/', (req, res) => {
  const { customer, items, total } = req.body || {};
  if (typeof customer !== 'string' || !Array.isArray(items) || typeof total !== 'number') {
    return res.status(400).json({ error: { name: 'validationError', message: 'customer, items and total are required' } });
  }
  const order = db.createOrder({ tenantId: req.user.tenantId, customer, items, total });
  res.status(201).json({ order });
});

router.put('/:id', (req, res) => {
  const order = db.getOrder(req.params.id);
  if (!order) return notFound(res);
  Object.assign(order, req.body);
  res.json({ order });
});

router.delete('/:id', (req, res) => {
  const order = db.getOrder(req.params.id);
  if (!order || order.tenantId !== req.user.tenantId) return notFound(res);
  db.deleteOrder(order.id);
  res.json({ message: 'Order deleted', id: order.id });
});

module.exports = router;
