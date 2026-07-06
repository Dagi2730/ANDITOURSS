import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@anditours.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  // 1. Hash the password using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  const tours = [];

  // Seed Tours: remove existing tours so the destination page starts empty.
  await prisma.tour.deleteMany({});

  // Seed Admin User
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN', password: hashedPassword },
    create: {
      id: randomUUID(),
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log('Seed completed. Admin login:', adminEmail, 'Password:', adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });