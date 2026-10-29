import 'dotenv/config';

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV || 'development';

export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_NAME = process.env.DB_NAME;
export const DB_PASSWORD = process.env.DB_PASSWORD; 

// JWT authentication configuration
export const JWT_SECRET = process.env.JWT_SECRET;


// Redis configuration shared with the Notification Service
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;
export const REDIS_TLS = process.env.REDIS_TLS === 'true';

// Frontend login page URL used in invitation emails
export const FRONTEND_LOGIN_URL =
    process.env.FRONTEND_ORIGIN?.trim() || undefined;

// Optional Redis authentication and TLS settings
export const redisAuthOptions = {
    ...(REDIS_PASSWORD ? { password: REDIS_PASSWORD } : {}),
    ...(REDIS_TLS ? { tls: {} } : {}),
};

export const JWT_ISSUER = 'lead-admin-auth';
export const JWT_AUDIENCE = 'lead-admin-ic';

export const JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS =
    Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS) || 3600;

export const JWT_PASSWORD_RESET_TOKEN_EXPIRES_IN_SECONDS =
    Number(process.env.JWT_PASSWORD_RESET_TOKEN_EXPIRES_IN_SECONDS) || 600;