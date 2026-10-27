import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client.js";

// Initialize Prisma client for role seeding.
function getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

const adapter = new PrismaMariaDb({
    host: getRequiredEnv("DB_HOST"),
    user: getRequiredEnv("DB_USER"),
    password: getRequiredEnv("DB_PASSWORD"),
    database: getRequiredEnv("DB_NAME"),
});

const prisma = new PrismaClient({ adapter });

// Seed the ADMIN and MANAGER roles.
async function seedRoles(): Promise<void> {
    const roles = [
        {
            name: "ADMIN",
            description: "Full access to admin panel functionality",
        },
        {
            name: "MANAGER",
            description: "Restricted access to admin panel functionality",
        },
    ];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: { description: role.description },
            create: role,
        });
    }

    console.log("Roles seeded successfully.");
}

seedRoles()
    .catch((error: unknown) => {
        console.error("Failed to seed roles:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });