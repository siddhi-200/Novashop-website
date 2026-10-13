const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;
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

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'product-service' }));

app.get('/products', (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  const category = String(req.query.category || '').toLowerCase();
  res.json(products.filter(p =>
    (!category || p.category.toLowerCase() === category) &&
    `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q)));
});

// Internal endpoint for the Order service (not exposed by the gateway).
// All-or-nothing: validates every line, then deducts stock and returns priced lines.
// Declared before /products/:id so "reserve" is not treated as an id.
app.post('/products/reserve', (req, res) => {
  const items = req.body && req.body.items;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'At least one item is required.' });
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
  res.json({ items: lines.map(({ p, qty }) => { p.stock -= qty; return { productId: p.id, name: p.name, price: p.price, quantity: qty }; }) });
});

app.get('/products/:id', (req, res) => {
  const p = products.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

app.listen(PORT, '0.0.0.0', () => console.log(`Product service listening on ${PORT}`));
