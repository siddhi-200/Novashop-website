# NovaShop Ecommerce: Monolith vs Microservices

## Project Overview

NovaShop is an educational ecommerce application developed to demonstrate and compare two software architectures: **Monolithic Architecture** and **Microservices Architecture**.

The application provides a simple online shopping experience, including product browsing, cart management, checkout, and order tracking.

## Architectures

### 1. Monolithic Architecture

The monolithic version uses a single Node.js and Express application to serve the frontend and handle product and order operations.

### 2. Microservices Architecture

The microservices version separates functionality into independent services connected through an API gateway.

- **API Gateway:** Serves the frontend and routes API requests.
- **Product Service:** Handles product-related operations.
- **Order Service:** Handles order-related operations.

## Features

- Browse and search products
- Filter products by category
- View product details
- Add products to the cart and update quantities
- Checkout with customer name and delivery address
- View order confirmation and order history
- Track orders by ID
- Access the help and FAQ page

## Technologies Used

- Node.js
- Express.js
- HTML, CSS and JavaScript
- Docker
- Docker Compose
- Git and GitHub

## Project Structure

```text
Novashop/
├── README.md
├── monolith/
│   ├── server.js
│   ├── package.json
│   └── public/
└── microservices/
    ├── docker-compose.yml
    ├── gateway/
    ├── product-service/
    └── order-service/
```

## Running the Monolithic Application

Open a terminal in the project directory and run:

```bash
cd monolith
npm install
PORT=3000 npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running the Microservices Application

Ensure Docker and Docker Compose are installed and running. Then execute:

```bash
cd microservices
docker compose up --build
```

Access the application using the gateway port configured in `docker-compose.yml`.

## Learning Objectives

- Understand monolithic and microservices architectures.
- Compare application organization and service separation.
- Learn how an API gateway routes requests.
- Practice containerization and multi-container deployment using Docker Compose.
- Use Git and GitHub for version control.

## Conclusion

NovaShop demonstrates two approaches to developing an ecommerce application. The monolithic architecture keeps functionality in one application, while the microservices architecture separates product and order functionality into independent services.

This project is intended for academic and learning purposes.
