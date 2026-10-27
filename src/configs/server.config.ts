import 'dotenv/config';

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV || 'development';

export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_NAME = process.env.DB_NAME;
export const DB_PASSWORD = process.env.DB_PASSWORD; 

// JWT authentication configuration
export const JWT_SECRET = process.env.JWT_SECRET;

export const JWT_ISSUER = 'lead-admin-auth';
export const JWT_AUDIENCE = 'lead-admin-ic';

export const JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS =
    Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS) || 3600;

export const JWT_PASSWORD_RESET_TOKEN_EXPIRES_IN_SECONDS =
    Number(process.env.JWT_PASSWORD_RESET_TOKEN_EXPIRES_IN_SECONDS) || 600;