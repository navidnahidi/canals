import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Environment variable configuration with validation and defaults
 */
export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  apiPrefix: process.env.API_PREFIX || '/api',

  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433', 10),
    username: process.env.DB_USERNAME || 'canals',
    password: process.env.DB_PASSWORD || 'canals',
    database: process.env.DB_DATABASE || 'canals',
  },

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Environment checks
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

/**
 * Validate required environment variables
 */
export function validateEnv(): void {
  const required = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];

  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0 && config.isProduction) {
    throw new Error(`Missing required environment variables in production: ${missing.join(', ')}`);
  }

  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing optional environment variables (using defaults): ${missing.join(', ')}`
    );
  }
}
