# Garrizon Backend

Spring Boot 3 backend for the Garrizon e-commerce platform.

## Features

- JWT Authentication with refresh tokens
- Role-based access control (USER, ADMIN)
- Product catalog management
- Database-persisted shopping cart
- Dual payment integration (Stripe & Paystack)
- Order management system
- Transactional emails via Resend
- Cloudinary image uploads
- Abandoned cart recovery (scheduled task)
- OpenAPI documentation (Swagger UI)
- Rate limiting on auth endpoints

## Tech Stack

- **Java 21**
- **Spring Boot 3.2**
- **PostgreSQL** (via Spring Data JPA)
- **Spring Security** + JWT
- **Stripe SDK** & **Paystack API**
- **Cloudinary SDK**
- **Springdoc OpenAPI**

## Prerequisites

- Java 21 or higher
- Maven 3.8+
- PostgreSQL 15+

## Environment Variables

Create `src/main/resources/application-dev.yml` or set environment variables:

```yaml
DATABASE_URL=jdbc:postgresql://localhost:5432/garrizon
DATABASE_USERNAME=garrizon
DATABASE_PASSWORD=garrizon123

JWT_SECRET=your-256-bit-secret-key-here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...

RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@garrizon.com
```

## Running Locally

```bash
# Install dependencies and run
./mvnw spring-boot:run

# Or build and run JAR
./mvnw clean package
java -jar target/garrizon-backend-0.0.1-SNAPSHOT.jar
```

The API will be available at `http://localhost:8080`

## API Documentation

Access Swagger UI at: `http://localhost:8080/swagger-ui.html`

## Project Structure

```
src/main/java/com/garrizon/
├── config/          # Security, CORS, OpenAPI configuration
├── controller/      # REST API endpoints
├── dto/             # Data Transfer Objects
├── exception/       # Custom exceptions and handlers
├── model/           # JPA entities
├── repository/      # Data access layer
├── scheduler/       # Scheduled tasks (abandoned cart)
├── security/        # JWT provider, filters
└── service/         # Business logic
```

## Key Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token

### Products
- `GET /api/products` - List products (with search/filters)
- `GET /api/products/{slug}` - Get product details

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{id}` - Update quantity
- `DELETE /api/cart/items/{id}` - Remove item

### Checkout
- `POST /api/checkout/stripe` - Create Stripe payment
- `POST /api/checkout/paystack` - Create Paystack payment

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order details

### Admin
- `GET /api/admin/metrics` - Dashboard metrics
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `PUT /api/admin/orders/{id}/status` - Update order status

## Deployment

### Railway
```bash
railway login
railway init
railway up
```

### Render
- Connect GitHub repository
- Build command: `./mvnw clean package -DskipTests`
- Start command: `java -jar target/garrizon-backend-0.0.1-SNAPSHOT.jar`

## License

MIT
