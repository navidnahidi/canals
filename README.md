# Canals API

Backend service for e-commerce order management platform with intelligent warehouse selection and geospatial routing.

## Features

- 🛒 **Order Management** - Create and manage e-commerce orders
- 📦 **Smart Warehouse Selection** - Automatically selects the closest warehouse with available inventory
- 🌍 **Geospatial Routing** - Uses Haversine formula for distance calculations
- 💳 **Payment Processing** - Integrated payment validation with Luhn algorithm
- 🗺️ **Address Geocoding** - Converts addresses to coordinates (mocked for development)
- 🔒 **Transaction Safety** - ACID-compliant with pessimistic locking for inventory
- 📊 **PostGIS Integration** - Spatial database capabilities
- ✅ **Type-Safe** - Full TypeScript with Zod validation

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/navidnahidi/canals.git
cd canals/api

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env

# 4. Start database
docker compose up -d

# 5. Run migrations
npm run migration:run

# 6. Seed test data
npm run seed

# 7. Start server
npm run dev
```

The server will be running at `http://localhost:3001`

## Prerequisites

- Node.js 20.19.5 (use `nvm use` to switch versions)
- Docker and Docker Compose
- npm

## Database Setup

This project uses PostgreSQL with PostGIS extension for geospatial queries.

### Starting the Database

Start the PostGIS container using Docker Compose:

```bash
docker compose up -d
```

This will start a PostGIS container on port **5433** (to avoid conflicts with other PostgreSQL instances on port 5432).

### Database Connection Details

- **Host:** `localhost`
- **Port:** `5433`
- **Database:** `canals`
- **User:** `canals`
- **Password:** `canals`

### Verifying the Database

Check if the container is running:

```bash
docker ps | grep canals-postgis
```

Connect to the database:

```bash
docker exec -it canals-postgis psql -U canals -d canals
```

Verify PostGIS is enabled:

```sql
SELECT PostGIS_version();
```

### Stopping the Database

```bash
docker compose down
```

To remove the database volume (⚠️ this will delete all data):

```bash
docker compose down -v
```

## Development

### Installation

```bash
npm install
```

### Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your local settings (defaults should work for local development)

### Running Migrations

Before starting the server, run the database migrations:

```bash
npm run migration:run
```

### Seeding the Database

To populate the database with test data:

```bash
npm run seed
```

This will create:
- 3 products (Laptop, Wireless Mouse, USB-C Cable)
- 3 warehouses (San Francisco, Los Angeles, Seattle)
- Inventory linking products to warehouses

### Running the Server

```bash
npm run dev
```

The server will start on `http://localhost:3001` (or the port specified in `.env`).

### Building for Production

```bash
npm run build
npm run start:prod
```

## Environment Variables

All environment variables are configured in the `.env` file. See `.env.example` for the complete list.

### Required Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NODE_ENV` | Environment mode | `development` | `production` |
| `PORT` | Server port | `3001` | `8080` |
| `DB_HOST` | Database host | `localhost` | `db.example.com` |
| `DB_PORT` | Database port | `5433` | `5432` |
| `DB_USERNAME` | Database user | `canals` | `myuser` |
| `DB_PASSWORD` | Database password | `canals` | `securepassword` |
| `DB_DATABASE` | Database name | `canals` | `mydb` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `API_PREFIX` | API route prefix | `/api` | `/v1` |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:3000` | `https://example.com` |

### Production Configuration

For production deployment, create a `.env.production` file or set environment variables directly:

```bash
NODE_ENV=production
PORT=3001
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password
DB_DATABASE=your-db-name
CORS_ORIGIN=https://your-frontend-domain.com
```

⚠️ **Security Note:** Never commit the `.env` file to version control. It's already in `.gitignore`.

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # TypeORM configuration
│   ├── env.ts        # Environment variable validation
│   └── runMigrations.ts
├── controllers/      # Request handlers
├── models/          # TypeORM entities
├── repositories/    # Data access layer
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── validators/      # Zod validation schemas
├── migrations/      # Database migrations
├── scripts/         # Utility scripts
└── index.ts         # Application entry point
```

## API Endpoints

### Health Check

```bash
GET /api/health
```

Returns server status and environment information.

### Create Order

```bash
POST /api/orders
```

Creates a new order with automatic warehouse selection and payment processing.

**Request Body:**

```json
{
  "customer": {
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "shippingAddress": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102",
    "country": "USA"
  },
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440001",
      "quantity": 2
    },
    {
      "productId": "550e8400-e29b-41d4-a716-446655440002",
      "quantity": 1
    }
  ],
  "creditCardNumber": "4532015112830366"
}
```

**Success Response (201):**

```json
{
  "message": "Order created successfully",
  "order": {
    "id": "uuid",
    "customerId": "uuid",
    "warehouseId": "uuid",
    "status": "PROCESSING",
    "totalAmount": "2659.97",
    "items": [...],
    "createdAt": "2025-12-17T00:00:00.000Z"
  }
}
```

**Error Responses:**

- `400` - Validation failed
- `500` - Order creation failed (insufficient inventory, payment failure, etc.)

## Testing the API

### Using cURL

After seeding the database, test the order creation endpoint:

```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "shippingAddress": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94102",
      "country": "USA"
    },
    "items": [
      {
        "productId": "550e8400-e29b-41d4-a716-446655440001",
        "quantity": 2
      },
      {
        "productId": "550e8400-e29b-41d4-a716-446655440002",
        "quantity": 1
      }
    ],
    "creditCardNumber": "4532015112830366"
  }'
```

**Test Data Available After Seeding:**

| Product ID | Name | Price |
|------------|------|-------|
| `550e8400-e29b-41d4-a716-446655440001` | Laptop | $1299.99 |
| `550e8400-e29b-41d4-a716-446655440002` | Wireless Mouse | $29.99 |
| `550e8400-e29b-41d4-a716-446655440003` | USB-C Cable | $19.99 |

**Test Credit Cards (Pass Luhn Algorithm):**
- `4532015112830366`
- `5425233430109903`
- `374245455400126`

## Architecture

### Design Patterns

- **Repository Pattern** - Data access abstraction (`src/repositories/`)
- **Service Layer** - Business logic separation (`src/services/`)
- **Controller Layer** - Request handling (`src/controllers/`)
- **Validation Layer** - Input validation with Zod (`src/validators/`)

### Key Components

#### Services

- **OrderService** - Orchestrates order creation, coordinates geocoding, warehouse selection, and payment
- **WarehouseService** - Finds optimal warehouse using Haversine distance calculation
- **GeocodingService** - Converts addresses to coordinates (mocked)
- **PaymentService** - Processes payments with Luhn validation (mocked)

#### Repositories

- **OrderRepository** - Order and order item data access
- **ProductRepository** - Product queries
- **WarehouseRepository** - Warehouse queries with coordinate filtering
- **WarehouseInventoryRepository** - Inventory management with pessimistic locking
- **CustomerRepository** - Customer lookup and creation

### Transaction Flow

1. **Validation** - Request validated with Zod schemas
2. **Geocoding** - Shipping address converted to coordinates
3. **Warehouse Selection** - Find warehouses with all products, select closest
4. **Payment Processing** - Validate and process payment
5. **Database Transaction** - Within a single transaction:
   - Lock inventory rows (pessimistic write lock)
   - Verify sufficient quantities
   - Decrement inventory
   - Get or create customer
   - Create order and order items
6. **Response** - Return created order with items

### Data Integrity

- **Pessimistic Locking** - Prevents race conditions during inventory updates
- **ACID Transactions** - All-or-nothing order creation
- **Foreign Key Constraints** - Referential integrity
- **NOT NULL Constraints** - Required field validation
- **Unique Constraints** - Prevent duplicates (SKU, email)

## API Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start server (requires build first) |
| `npm run migration:run` | Run database migrations |
| `npm run migration:revert` | Revert last migration |
| `npm run migration:show` | Show migration status |
| `npm run db:reset` | Drop all tables (⚠️ destructive) |
| `npm run seed` | Seed database with test data |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostGIS container is running
docker ps | grep canals-postgis

# View container logs
docker logs canals-postgis

# Restart container
docker compose restart
```

### Migration Errors

```bash
# Check migration status
npm run migration:show

# Reset database (⚠️ deletes all data)
npm run db:reset
npm run migration:run
npm run seed
```

### Port Already in Use

If port 3001 is already in use, update `PORT` in your `.env` file:

```bash
PORT=3002
```

### Order Creation Fails

Common issues:
- **No warehouse found** - Run `npm run seed` to populate test data
- **Insufficient inventory** - Reduce order quantities or reseed database
- **Payment failed** - Use valid test credit card numbers (see Testing section)

## Technologies

- **Runtime**: Node.js 20.x
- **Language**: TypeScript
- **Framework**: Koa.js
- **ORM**: TypeORM
- **Database**: PostgreSQL with PostGIS
- **Validation**: Zod
- **Linting**: ESLint + Prettier
- **Containerization**: Docker Compose
