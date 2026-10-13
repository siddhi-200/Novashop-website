Ecommerce Application: Monolithic vs Microservices

Project Overview

This project demonstrates the development of an Ecommerce Application using two software architectures: Monolithic Architecture and Microservices Architecture.

The application allows users to browse products, search for items, add products to a shopping cart, proceed to checkout, and place orders.

Objectives

- To develop an ecommerce application using monolithic architecture.
- To implement the same application using microservices architecture.
- To understand the differences between the two architectures.
- To use Docker and Docker Compose for containerization and service management.
- To compare application structure, deployment, and maintainability.

Technologies Used

- Node.js
- Express.js
- HTML, CSS, and JavaScript
- Docker
- Docker Compose
- Git and GitHub

Application 1: Monolithic Architecture

In the monolithic architecture, the application's functionality is managed by a single application.

Features:

- Product catalogue
- Product search
- Shopping cart
- Checkout
- Order confirmation

Local URL: "http://localhost:3000"

Application 2: Microservices Architecture

In the microservices architecture, the application is divided into independent services.

Services:

- API Gateway: Entry point for frontend requests.
- Product Service: Handles product information.
- Order Service: Handles order creation and management.

Docker Compose is used to build and run the services together.

Local URL: "http://localhost:8080"

How to Run

Monolithic Application

cd monolith
npm install
npm start

Open "http://localhost:3000".

Microservices Application

From the project root, run:

docker compose -f microservices/docker-compose.yml up --build

Open "http://localhost:8080".

Comparison

Monolithic Architecture| Microservices Architecture
Single application| Multiple independent services
Simpler deployment structure| Services can be deployed independently
Components are more tightly coupled| Services communicate through APIs
Scaling generally applies to the application| Individual services can be scaled separately

Conclusion

This project demonstrates two approaches to building an ecommerce application. The monolithic version keeps the application in a single unit, while the microservices version separates product and order functionality behind an API gateway.

