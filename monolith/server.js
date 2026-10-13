const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_QTY = 10;

app.use(express.json({ limit: '10kb' }));

const products = [
  { id: 1, name: 'Wireless Headphones', category: 'Audio', price: 1999, stock: 18, emoji: '🎧', description: 'Comfortable everyday sound' },
  { id: 2, name: 'Mechanical Keyboard', category: 'Electronics', price: 2499, stock: 12, emoji: '⌨️', description: 'Tactile keys for work and play' },
  { id: 3, name: 'Gaming Mouse', category: 'Electronics', price: 999, stock: 20, emoji: '🖱️', description: 'Precise tracking, ergonomic grip' },
  { id: 4, name: 'Smart Watch', category: 'Wearables', price: 3499, stock: 8, emoji: '⌚', description: 'Keep your day in sync' },
  { id: 5, name: 'Bluetooth Speaker', category: 'Audio', price: 1499, stock: 15, emoji: '🔊', description: 'Portable music anywhere' },
  { id: 6, name: 'Everyday Backpack', category: 'Accessories', price: 1299, stock: 10, emoji: '🎒', description: 'Room for all your essentials' }
];
const orders = [];

app.get('/api/health', (_req, res) => res.json({ status: 'ok', architecture: 'monolith' }));

app.get('/api/products', (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  const category = String(req.query.category || '').toLowerCase();
  res.json(products.filter(p =>
    (!category || p.category.toLowerCase() === category) &&
    `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q)));
});

app.get('/api/products/:id', (req, res) => {
  const p = products.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

app.post('/api/orders', (req, res) => {
  const { customerName, address, items } = req.body || {};
  const name = typeof customerName === 'string' ? customerName.trim() : '';
  const addr = typeof address === 'string' ? address.trim() : '';
  if (!name || !addr || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'Name, address, and at least one item are required.' });
  }
  if (name.length > 100 || addr.length > 300) return res.status(400).json({ error: 'Name or address is too long.' });

  // Validate everything first so a failed order never leaves stock half-deducted.
  const wanted = new Map();
  for (const item of items) {
    const qty = Number(item && item.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      return res.status(400).json({ error: `Quantity must be a whole number between 1 and ${MAX_QTY}.` });
    }
    const id = Number(item.productId);
    wanted.set(id, (wanted.get(id) || 0) + qty);
  }
  const lines = [];
  for (const [id, qty] of wanted) {
    const p = products.find(x => x.id === id);
    if (!p) return res.status(400).json({ error: `Unknown product ${id}` });
    if (qty > MAX_QTY) return res.status(400).json({ error: `You can order at most ${MAX_QTY} of ${p.name}.` });
    if (p.stock < qty) return res.status(400).json({ error: `${p.name} is out of stock for requested quantity` });
    lines.push({ p, qty });
  }
  let total = 0;
  const orderItems = lines.map(({ p, qty }) => {
    p.stock -= qty; total += p.price * qty;
    return { productId: p.id, name: p.name, price: p.price, quantity: qty };
  });
  const order = {
    id: `NS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    customerName: name, address: addr, items: orderItems, total,
    status: 'Confirmed', createdAt: new Date().toISOString()
  };
  orders.push(order);
  res.status(201).json(order);
});

// Look up one order by ID (the list of all orders is intentionally not exposed: it contains customer addresses).
app.get('/api/orders/:id', (req, res) => {
  const o = orders.find(x => x.id === req.params.id);
  if (!o) return res.status(404).json({ error: 'Order not found' });
  res.json(o);
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir, { extensions: ['html'] }));
app.use((_req, res) => res.status(404).sendFile(path.join(publicDir, '404.html')));

app.listen(PORT, '0.0.0.0', () => console.log(`NovaShop monolith running at http://localhost:${PORT}`));
