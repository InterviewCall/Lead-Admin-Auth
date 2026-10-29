import "dotenv/config";
import argon2 from "argon2";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client.js";

// Initialize Prisma client for admin seeding.
const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
});

const prisma = new PrismaClient({ adapter });

// Seed the initial administrator account.
async function seedAdmin(): Promise<void> {
    const name = "Test Admin";
    const email = "testadmin@gmail.com";
    const password = "admin@1234";

    const adminRole = await prisma.role.findUnique({
        where: {
            name: "ADMIN",
        },
    });

    if (!adminRole) {
        throw new Error("ADMIN role not found. Run the roles seeder first.");
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        console.log("Admin user already exists. Seeding skipped.");
        return;
    }

    const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id,
    });

    await prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
            roleId: adminRole.id,
            isActive: true,
        },
    });

    console.log("Admin user seeded successfully.");
}

seedAdmin()
    .catch((error: unknown) => {
        console.error("Failed to seed admin:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });