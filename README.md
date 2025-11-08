# Product Review System API

A production-ready RESTful API for product reviews built with Node.js, TypeScript, Express, Prisma ORM, and PostgreSQL. Features complete authentication, role-based access control, image uploads, and comprehensive CRUD operations.

## Overview

This API demonstrates enterprise-level backend architecture with secure authentication, file handling, email workflows, and scalable database design. Built to handle real-world product review scenarios with admin moderation capabilities.

## Key Features

- **JWT Authentication** - Dual-token system (access/refresh) with secure token rotation
- **Email Verification** - Token-based email verification and password reset flows
- **Role-Based Access Control** - User and admin roles with protected routes
- **Image Management** - Cloudinary integration for optimized product image uploads
- **Review System** - Star ratings with duplicate prevention (one review per user per product)
- **Search & Pagination** - Efficient filtering by category and keyword search
- **Type Safety** - Full TypeScript implementation with strict typing
- **Security** - Helmet, CORS, rate limiting, bcrypt password hashing
- **Database Design** - Normalized PostgreSQL schema with proper relationships

## Tech Stack

**Backend:** Node.js 20+ | TypeScript 5.9 | Express 5.1  
**Database:** PostgreSQL 16+ | Prisma ORM 6.18  
**Authentication:** JWT | bcrypt  
**File Upload:** Cloudinary | Multer  
**Email:** Nodemailer  
**Security:** Helmet | CORS | Rate Limiting

## Architecture

```mermaid
graph TB
    Client[Client/Frontend]
    Routes[Routes Layer]
    MW[Middleware Layer]
    Controllers[Controllers Layer]
    Services[Services Layer]
    Repos[Repositories Layer]
    DB[(PostgreSQL Database)]
    External[External Services<br/>Cloudinary, Email]

    Client -->|HTTP Request| Routes
    Routes -->|Auth Check| MW
    MW -->|Validated Request| Controllers
    Controllers -->|Business Logic| Services
    Services -->|Database Operations| Repos
    Repos -->|Prisma ORM| DB
    Services -->|Upload/Email| External
    Controllers -->|HTTP Response| Client

    style Client fill:#e1f5ff
    style Routes fill:#fff4e1
    style MW fill:#ffe1f5
    style Controllers fill:#e1ffe1
    style Services fill:#f5e1ff
    style Repos fill:#ffe1e1
    style DB fill:#333,color:#fff
    style External fill:#e1e1ff
```

**Design Pattern:** Layered architecture separating concerns - routes handle HTTP, controllers process requests, services contain business logic, and repositories manage database operations.

## Project Structure

```
product-review-system/
├── prisma/
│   ├── schema.prisma           # Database schema definition
│   ├── seed.ts                 # Database seeding script
│   └── migrations/             # Migration history
├── src/
│   ├── config/                 # App configuration (DB, Cloudinary, env)
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utilities (JWT, email, validation, logging)
│   ├── repositories/           # Database access layer
│   ├── services/               # Business logic layer
│   ├── controllers/            # Request handlers
│   ├── routes/                 # API endpoint definitions
│   ├── middlewares/            # Auth, upload, error handling
│   ├── app.ts                  # Express configuration
│   └── server.ts               # Server entry point
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint                    | Description               |
| ------ | --------------------------- | ------------------------- |
| POST   | `/api/auth/register`        | Register new user         |
| POST   | `/api/auth/login`           | User login                |
| POST   | `/api/auth/refresh`         | Refresh access token      |
| POST   | `/api/auth/logout`          | User logout               |
| POST   | `/api/auth/verify-email`    | Verify email address      |
| POST   | `/api/auth/forgot-password` | Request password reset    |
| POST   | `/api/auth/reset-password`  | Reset password with token |

### Products

| Method | Endpoint                           | Description                  | Auth   |
| ------ | ---------------------------------- | ---------------------------- | ------ |
| GET    | `/api/products`                    | Get all products (paginated) | Public |
| GET    | `/api/products/:id`                | Get single product           | Public |
| GET    | `/api/products/category/:category` | Filter by category           | Public |
| GET    | `/api/products/search?q=keyword`   | Search products              | Public |

### Reviews

| Method | Endpoint                           | Description         | Auth   |
| ------ | ---------------------------------- | ------------------- | ------ |
| POST   | `/api/products/:productId/reviews` | Create review       | User   |
| GET    | `/api/reviews/me`                  | Get own reviews     | User   |
| GET    | `/api/products/:productId/reviews` | Get product reviews | Public |
| PUT    | `/api/reviews/:id`                 | Update own review   | User   |
| DELETE | `/api/reviews/:id`                 | Delete own review   | User   |

### Admin

| Method | Endpoint                   | Description       | Auth  |
| ------ | -------------------------- | ----------------- | ----- |
| POST   | `/api/admin/products`      | Create product    | Admin |
| PUT    | `/api/admin/products/:id`  | Update product    | Admin |
| DELETE | `/api/admin/products/:id`  | Delete product    | Admin |
| DELETE | `/api/admin/reviews/:id`   | Delete any review | Admin |
| PATCH  | `/api/admin/users/:id/ban` | Ban/unban user    | Admin |

## Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL v16+
- Cloudinary account
- SMTP credentials

### Installation

```bash
# Clone repository
git clone https://github.com/kehinde-durodola/product-review-system.git
cd product-review-system

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Start development server
npm run dev
```

Server runs at `http://localhost:5000`

### Environment Variables

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/product_review_db"
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## Authentication Flow

This API uses JWT with dual-token authentication:

- **Access Token** (15 min): For API requests
- **Refresh Token** (7 days): Stored in DB, used to refresh access tokens

```bash
# Use access token for authenticated requests
Authorization: Bearer YOUR_ACCESS_TOKEN

# Refresh when access token expires
POST /api/auth/refresh
{ "refreshToken": "YOUR_REFRESH_TOKEN" }
```

## Development

```bash
npm run dev              # Start with hot reload
npm run build            # Compile TypeScript
npm start                # Run production build
npm run type-check       # TypeScript validation
npm run prisma:studio    # Open database GUI
```

## Technical Highlights

- **Layered Architecture**: Clear separation of concerns across routes, controllers, services, and repositories
- **Type Safety**: Comprehensive TypeScript coverage with strict mode enabled
- **Security**: bcrypt password hashing, JWT with refresh rotation, helmet headers, CORS configuration
- **Error Handling**: Centralized error middleware with structured error responses
- **Validation**: Input validation on all user-submitted data
- **Database**: Prisma ORM with migrations, proper indexing, and relationship management
- **File Uploads**: Cloudinary integration with image optimization
- **Email System**: Transactional emails for verification and password reset

## Deployment

Production-ready with environment-based configuration. Compatible with Render, Railway, DigitalOcean App Platform, or any Node.js hosting service. Includes PostgreSQL database configuration and Cloudinary CDN integration.

## Author

**Kehinde Durodola**

- GitHub: [@kehinde-durodola](https://github.com/kehinde-durodola)
- LinkedIn: [Kehinde Durodola](https://www.linkedin.com/in/kehinde-durodola)

## License

MIT License - see [LICENSE](LICENSE) file for details.
