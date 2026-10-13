# NovaShop Ecommerce — Monolith vs Microservices

## 1. Project Overview

NovaShop is an educational ecommerce web application developed to demonstrate the differences between Monolithic Architecture and Microservices Architecture.

Both implementations provide a storefront for browsing products, managing a shopping cart, checking out, and viewing order details.

## 2. Architectures

### Monolithic Architecture

The monolithic implementation uses a single Node.js and Express application to serve the frontend and handle product and order operations.

- Application entry point: `monolith/server.js`
- Frontend: `monolith/public/`
- Default port: `3000`
- Product catalogue, stock, and orders are stored in application memory.

### Microservices Architecture

The microservices implementation separates the application into three components:

- **API Gateway:** Serves the storefront and forwards supported API requests to backend services.
- **Product Service:** Manages the product catalogue and stock reservations.
- **Order Service:** Validates checkout details, requests stock reservation from the Product Service, calculates the order total, and creates orders.

The services communicate over a private Docker bridge network when deployed using Docker Compose.

## 3. Application Features

- Browse six predefined products across different categories.
- Search products by name, category, or description.
- Filter products by category.
- View product details, prices, and stock availability.
- Add products to a browser-based shopping cart.
- Change product quantities, subject to quantity and stock limits.
- Checkout using a customer name and delivery address.
- View order confirmation and retrieve order details by order ID.
- View previously placed order IDs stored in browser local storage.
- Access the Help/FAQ and custom 404 pages.
- Check application and service health endpoints.

## 4. Technologies Used

- Node.js 18 or later
- Express.js
- HTML5
- CSS3
- JavaScript
- Docker
- Docker Compose
- Git and GitHub

## 5. Project Structure

```text
novashop-ecommerce/
├── README.md
├── .gitignore
├── monolith/
│   ├── server.js
│   ├── package.json
│   ├── .dockerignore
│   └── public/
│       ├── index.html
│       ├── product.html
│       ├── cart.html
│       ├── checkout.html
│       ├── order.html
│       ├── orders.html
│       ├── about.html
│       ├── 404.html
│       ├── app.js
│       └── styles.css
└── microservices/
    ├── docker-compose.yml
    ├── .env.example
    ├── gateway/
    │   ├── server.js
    │   ├── package.json
    │   ├── Dockerfile
    │   └── public/
    ├── product-service/
    │   ├── server.js
    │   ├── package.json
    │   └── Dockerfile
    └── order-service/
        ├── server.js
        ├── package.json
        └── Dockerfile
```

## 6. API Endpoints

### Monolithic Application

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Application health and architecture |
| GET | `/api/products` | List, search, and filter products |
| GET | `/api/products/:id` | Retrieve a product by ID |
| POST | `/api/orders` | Validate and create an order |
| GET | `/api/orders/:id` | Retrieve an order by ID |

### Microservices API Gateway

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Gateway health and architecture |
| GET | `/api/products` | Forward product listing requests |
| GET | `/api/products/:id` | Forward product detail requests |
| POST | `/api/orders` | Forward checkout requests |
| GET | `/api/orders/:id` | Forward order lookup requests |

The Product Service and Order Service also provide their own internal health endpoints. The Product Service exposes an internal stock-reservation endpoint used by the Order Service; the gateway does not expose this endpoint to the browser.

## 7. Running the Monolithic Application

Requirements: Node.js 18 or later and npm.

From the project root, execute:

```bash
cd monolith
npm install
npm start
```

Open the application at:

http://localhost:3000

To use a different port, set the `PORT` environment variable before starting the application.

## 8. Running Microservices with Docker Compose

Requirements: Docker Engine and Docker Compose.

From the project root, run:

```bash
docker compose -f microservices/docker-compose.yml up --build
```

Open the application at:

http://localhost:8080

The default port mapping is:

| Component | Container Port | Host Access |
|---|---:|---|
| API Gateway | 8080 | `localhost:8080` |
| Product Service | 3001 | Internal Docker network |
| Order Service | 3002 | Internal Docker network |

Only the API Gateway is published to the host by the provided Compose configuration.

To stop the services, run:

```bash
docker compose -f microservices/docker-compose.yml down
```

To change the gateway host port, create a `.env` file in the `microservices/` directory using `.env.example` as a template and set `GATEWAY_HOST_PORT`.

## 9. Data Storage and Limitations

- Product catalogue, stock, and order data are held in application memory.
- Data is not persisted in a database and resets when the relevant service restarts.
- The shopping cart and saved order IDs use browser local storage.
- The application does not implement user authentication, real payment processing, or production-grade persistence.
- This is an educational demonstration and is not intended for production use.

## 10. Learning Objectives

- Understand the structure of a monolithic application.
- Understand service separation and API gateway routing.
- Observe communication between independent backend services.
- Learn containerization and multi-container orchestration using Docker Compose.
- Compare application organization, deployment, and service responsibilities.

## 11. Conclusion

NovaShop demonstrates two ways to organize an ecommerce application. The monolithic implementation combines frontend serving and backend operations in one application. The microservices implementation separates product and order responsibilities behind an API gateway.

The project provides a practical foundation for studying architectural differences, service communication, and containerized application deployment.
