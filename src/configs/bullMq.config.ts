import { Redis } from 'ioredis';

import {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
    REDIS_TLS,
} from './server.config.js';

export const bullMqConnection = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    ...(REDIS_PASSWORD ? { password: REDIS_PASSWORD } : {}),
    ...(REDIS_TLS ? { tls: {} } : {}),
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
});