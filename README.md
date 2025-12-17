# Canals API

Backend service for e-commerce order management platform.

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
