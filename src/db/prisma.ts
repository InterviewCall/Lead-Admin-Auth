
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client.js';

import {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
} from '../configs/server.config.js';

// Validate required database configuration before creating the Prisma client.
function getRequiredConfig(
    name: string,
    value: string | undefined
): string {
    if (!value?.trim()) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

const adapter = new PrismaMariaDb({
    host: getRequiredConfig('DB_HOST', DB_HOST),
    user: getRequiredConfig('DB_USER', DB_USER),
    password: getRequiredConfig('DB_PASSWORD', DB_PASSWORD),
    database: getRequiredConfig('DB_NAME', DB_NAME),
});

// Export one shared Prisma client for database operations.
const prisma = new PrismaClient({ adapter });

export default prisma;
