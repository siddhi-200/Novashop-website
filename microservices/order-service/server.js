const express = require('express'); // global fetch requires Node 18+

const app = express();
const PORT = process.env.PORT || 3002;
const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
app.use(express.json({ limit: '10kb' }));

const orders = [];

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'order-service' }));

app.post('/orders', async (req, res) => {
  const { customerName, address, items } = req.body || {};
  const name = typeof customerName === 'string' ? customerName.trim() : '';
  const addr = typeof address === 'string' ? address.trim() : '';
  if (!name || !addr || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'Name, address, and at least one item are required.' });
  }
  if (name.length > 100 || addr.length > 300) return res.status(400).json({ error: 'Name or address is too long.' });

  // The Product service owns catalogue and stock; ask it to reserve the items and price them.
  let reserved;
  try {
    const r = await fetch(`${PRODUCT_URL}/products/reserve`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map(i => ({ productId: i && i.productId, quantity: i && i.quantity })) }),
      signal: AbortSignal.timeout(5000)
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(r.status === 400 ? 400 : 502).json({ error: data.error || 'Product service error' });
    reserved = data.items;
  } catch {
    return res.status(503).json({ error: 'Product service is unavailable. Please try again shortly.' });
  }

  const total = reserved.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const order = {
    id: `NS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    customerName: name, address: addr, items: reserved, total,
    status: 'Confirmed', createdAt: new Date().toISOString()
  };
  orders.push(order);
  res.status(201).json(order);
});

app.get('/orders/:id', (req, res) => {
  const o = orders.find(x => x.id === req.params.id);
  if (!o) return res.status(404).json({ error: 'Order not found' });
  res.json(o);
});

app.listen(PORT, '0.0.0.0', () => console.log(`Order service listening on ${PORT}`));
