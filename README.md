# NovaShop Ecommerce — Monolith vs Microservices

A small demo ecommerce application implemented in two ways:
1. **Monolith**: one Node.js + Express application serves the UI and product/order APIs.
2. **Microservices**: a gateway serves the same UI and routes API calls to independent Product and Order services.

## Features
- Browse seeded products, filter by category, search by name/category/description
- Product detail pages with quantity picker and related products
- Cart (kept in the browser) with quantity controls
- Checkout with customer name and delivery address
- Order confirmation page, "My orders" history and track-by-ID
- Help/FAQ page and a custom 404 page
- Health endpoints for services

## Pages
| Route | Page |
|---|---|
| `/` | Shop (supports `?q=` search and `?category=`) |
| `/product?id=N` | Product details |
| `/cart` | Shopping cart |
| `/checkout` | Checkout form |
| `/order?id=ID` | Order confirmation / order details |
| `/orders` | My orders + track an order |
| `/about` | About & help (FAQ) |

## API (same in both architectures)
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Health + architecture |
| GET | `/api/products?q=&category=` | List / search products |
| GET | `/api/products/:id` | One product |
| POST | `/api/orders` | Place an order (validates stock, all-or-nothing) |
| GET | `/api/orders/:id` | Look up one order |

> Demo note: this is an educational sample. It does not include authentication, real payments, or production-grade persistence. Product/order data is held in memory and resets when services restart.

## Requirements
- Node.js 18+ for local mode
- Docker + Docker Compose for container mode

## Run monolith
```bash
cd monolith
npm install
npm start
```
Open http://localhost:3000

## Run microservices with Docker Compose
From the project root:
```bash
docker compose -f microservices/docker-compose.yml up --build
```
Open http://localhost:8080

## Run microservices without Docker
Open three terminals (start the product service first):
```bash
cd microservices/product-service && npm install && npm start
```
```bash
cd microservices/order-service && npm install && npm start
```
```bash
cd microservices/gateway && npm install && npm start
```
Open http://localhost:8080. Set `PRODUCT_SERVICE_URL` (gateway and order service) and `ORDER_SERVICE_URL` (gateway) if services are not on their default localhost ports. To publish the gateway on a different host port with Docker, copy `microservices/.env.example` to `microservices/.env` and edit `GATEWAY_HOST_PORT`.

## Architecture
- Monolith: Browser → Express app → in-memory product/order data
- Microservices: Browser → Gateway (8080) → Product Service (3001) / Order Service (3002)
- The Product service owns the catalogue and stock. The Order service calls its internal `POST /products/reserve` to price items and deduct stock; the gateway deliberately does not expose that endpoint.
- The storefront lives in `public/` (static HTML + `app.js` + `styles.css`) in both `monolith/` and `microservices/gateway/`. The two copies are identical; edit one and copy it to the other.

## Suggested screenshots for submission
Capture the running browser application:
1. Product catalogue (`/`)
2. Search result after typing a product name
3. Cart and checkout flow
4. Order confirmation
5. Terminal showing both architectures running
6. Optional: architecture diagram or Docker Compose output

## Public GitHub submission
Create a public repository, then:
```bash
git init
git add .
git commit -m "Add ecommerce monolith and microservices"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/novashop-ecommerce.git
git push -u origin main
```
