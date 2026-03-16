
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Manual .env loading
try {
    const envPath = path.resolve(__dirname, '../../../.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
        console.log("✅ Loaded environment variables from .env");
    } else {
        console.warn("⚠️ .env file not found at:", envPath);
    }
} catch (e) {
    console.error("Failed to load .env:", e);
}

const prisma = new PrismaClient({
    log: ['error', 'warn'],
});

async function verifyData() {
    console.log("🔍 Verifying Database Connection and Data...");

    try {
        // 1. Services
        const servicesCount = await prisma.service.count();
        console.log(`✅ Services: ${servicesCount} records found.`);

        // 2. Team
        const teamCount = await prisma.teamMember.count();
        console.log(`✅ Team Members: ${teamCount} records found.`);

        // 3. Testimonials
        const testimonialsCount = await prisma.testimonial.count();
        console.log(`✅ Testimonials: ${testimonialsCount} records found.`);

        // 4. Products
        const productsCount = await prisma.product.count();
        console.log(`✅ Products: ${productsCount} records found.`);

        console.log("🎉 Verification Successful: Database is connected and accessible.");
    } catch (error) {
        console.error("❌ Verification Failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

verifyData();
