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

### Running the Server

```bash
npm run dev
```

The server will start on `http://localhost:3001` (or the port specified in `PORT` environment variable).

### Building for Production

```bash
npm run build
npm run start:prod
```

## Project Structure

```
src/
  └── index.ts    # Main application entry point
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `DATABASE_URL` - PostgreSQL connection string (e.g., `postgresql://canals:canals@localhost:5433/canals`)
- `DISTANCE_UNIT` - Distance unit for warehouse selection: `km` (default) or `miles`
- `NODE_ENV` - Environment: `development` or `production`

## Configuration

### Distance Units

The system supports both kilometers and miles for warehouse distance calculations. Set the `DISTANCE_UNIT` environment variable:

```bash
# Use kilometers (default)
DISTANCE_UNIT=km

# Use miles
DISTANCE_UNIT=miles
```

This affects warehouse selection - the system will find the warehouse closest to the shipping address using the configured unit.
