# 🍽️ Garrizon - Premium Food E-commerce Platform

A complete, production-ready e-commerce platform for selling food items with dual payment providers, transactional emails, and a comprehensive admin dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-21-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (USER, ADMIN)
- Secure password hashing with BCrypt
- Rate limiting on authentication endpoints

### 🛍️ E-commerce Core
- Product catalog with categories
- Advanced search and filtering
- Pagination support
- Database-persisted shopping cart
- Dual payment integration (Stripe & Paystack)
- Order management system
- Order status tracking

### 👨‍💼 Admin Dashboard
- Real-time metrics and analytics
- Revenue charts (last 30 days)
- Product CRUD operations
- Image upload to Cloudinary
- Order management with status updates
- Customer management

### 📧 Transactional Emails
- Order confirmation emails
- Order status update notifications
- Abandoned cart recovery (automated)
- Beautiful email templates with React Email

### 🚀 Production Ready
- Docker support for both frontend and backend
- Vercel-ready frontend configuration
- Railway/Render-ready backend
- OpenAPI documentation (Swagger UI)
- Comprehensive error handling
- Environment-based configuration

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2 (Java 21)
- **Security**: Spring Security + JWT
- **Database**: PostgreSQL + Spring Data JPA
- **Payments**: Stripe SDK, Paystack API
- **Email**: Resend API
- **File Upload**: Cloudinary SDK
- **Documentation**: Springdoc OpenAPI
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand + React Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Email Templates
- **Framework**: React Email
- **Styling**: Inline CSS (email-safe)

## 📁 Project Structure

```
garrizon/
├── backend/              # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/garrizon/
│   │   │   │   ├── config/         # Security, CORS, OpenAPI
│   │   │   │   ├── controller/     # REST endpoints
│   │   │   │   ├── model/          # JPA entities
│   │   │   │   ├── repository/     # Data access
│   │   │   │   ├── service/        # Business logic
│   │   │   │   ├── security/       # JWT, filters
│   │   │   │   ├── dto/            # Data transfer objects
│   │   │   │   └── scheduler/      # Scheduled tasks
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   └── ...
│   │   ├── pages/        # Route pages
│   │   │   ├── admin/    # Admin dashboard
│   │   │   └── ...
│   │   ├── stores/       # Zustand stores
│   │   ├── lib/          # Utilities, API client
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # TypeScript types
│   ├── public/
│   ├── Dockerfile
│   ├── vercel.json
│   ├── package.json
│   └── vite.config.ts
│
├── emails/               # Email templates
│   ├── emails/
│   │   ├── order-confirmation.tsx
│   │   ├── order-status-update.tsx
│   │   └── abandoned-cart.tsx
│   └── package.json
│
├── docker-compose.yml    # Local development setup
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Java 21 or higher
- Node.js 18 or higher
- PostgreSQL 15 or higher
- Docker (optional, for containerized setup)

### Environment Variables

Create the following environment files:

#### Backend: `backend/src/main/resources/application-dev.yml`
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/garrizon
    username: your_db_user
    password: your_db_password

jwt:
  secret: your-256-bit-secret-key-here
  access-token-expiration: 900000      # 15 minutes
  refresh-token-expiration: 604800000  # 7 days

cloudinary:
  cloud-name: your_cloudinary_cloud_name
  api-key: your_cloudinary_api_key
  api-secret: your_cloudinary_api_secret

stripe:
  secret-key: sk_test_your_stripe_secret_key
  public-key: pk_test_your_stripe_public_key

paystack:
  secret-key: sk_test_your_paystack_secret_key
  public-key: pk_test_your_paystack_public_key

resend:
  api-key: re_your_resend_api_key
  from-email: noreply@garrizon.com
```

#### Frontend: `frontend/.env`
```env
VITE_API_URL=http://localhost:8080/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Local Development

#### Option 1: Docker Compose (Recommended)
```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up -d

# Backend will be available at http://localhost:8080
# Frontend will be available at http://localhost:5173
# PostgreSQL will be available at localhost:5432
```

#### Option 2: Manual Setup

**1. Start PostgreSQL**
```bash
# Using Docker
docker run --name garrizon-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=garrizon -p 5432:5432 -d postgres:15

# Or use your local PostgreSQL installation
```

**2. Start Backend**
```bash
cd backend
./mvnw spring-boot:run

# API will be available at http://localhost:8080
# Swagger UI at http://localhost:8080/swagger-ui.html
```

**3. Start Frontend**
```bash
cd frontend
npm install
npm run dev

# App will be available at http://localhost:5173
```

**4. Email Templates (Optional - for development)**
```bash
cd emails
npm install
npm run dev

# Preview at http://localhost:3000
```

## 📚 API Documentation

Once the backend is running, access the interactive API documentation at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## 🔑 Default Admin Account

After first run, create an admin account by registering and manually updating the role in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@garrizon.com';
```

Or use the registration endpoint with admin flag (if implemented).

## 🧪 Testing

### Test Payment Cards

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

**Paystack Test Cards:**
- Success: `5060 6666 6666 6666 6666` (CVV: 123, PIN: 1234)

### Test Email Delivery
- Use Resend's test mode to preview emails without sending
- Check the Resend dashboard for sent emails

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway)
```bash
cd backend
# Connect to Railway and deploy
railway up
```

### Backend (Render)
- Connect your GitHub repository
- Set build command: `cd backend && ./mvnw clean package -DskipTests`
- Set start command: `java -jar backend/target/garrizon-0.0.1-SNAPSHOT.jar`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@garrizon.com or open an issue on GitHub.

---

Built with ❤️ for food lovers everywhere
