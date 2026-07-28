const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

// Create a new order (Checkout)
router.post('/', async (req, res) => {
  const { fullName, phone, address, city, pincode, items } = req.body;

  if (!fullName || !phone || !address || !city || !pincode || !items || !items.length) {
    return res.status(400).json({ message: 'Missing shipping details or order items.' });
  }

  try {
    let calculatedTotal = 0;
    const validatedItems = [];

    // Validate items and check stock
    for (const item of items) {
      const product = await db.get('SELECT * FROM products WHERE id = ?', [item.id]);
      if (!product) {
        return res.status(400).json({ message: `Product "${item.name}" not found.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }

      calculatedTotal += product.price * item.quantity;
      validatedItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }

    // Insert Order
    const orderResult = await db.run(
      `INSERT INTO orders (fullName, phone, address, city, pincode, totalAmount, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [fullName, phone, address, city, pincode, calculatedTotal]
    );

    const orderId = orderResult.id;

    // Insert Order Items and update product stock
    for (const item of validatedItems) {
      await db.run(
        `INSERT INTO order_items (orderId, productId, name, price, quantity) 
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.id, item.name, item.price, item.quantity]
      );

      // Decrement stock
      await db.run(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.id]
      );
    }

    res.status(201).json({
      message: 'Order placed successfully!',
      orderId,
      totalAmount: calculatedTotal
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error placing your order. Please try again.' });
  }
});

// GET all orders (Admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    // Get orders
    const orders = await db.query('SELECT * FROM orders ORDER BY createdAt DESC');
    
    // For each order, fetch its items
    const ordersWithItems = [];
    for (const order of orders) {
      const items = await db.query(
        'SELECT * FROM order_items WHERE orderId = ?',
        [order.id]
      );
      ordersWithItems.push({
        ...order,
        items
      });
    }

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error fetching orders.' });
  }
});

// PUT update order status (Admin only)
router.put('/:id/status', requireAdmin, async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid order status.' });
  }

  try {
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    res.json({ message: 'Order status updated successfully.', orderId, status });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error updating order status.' });
  }
});

module.exports = router;
