import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@anditours.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  // 1. Hash the password using bcrypt (standardized approach)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  const tours = [
    {
      title: 'Lalibela Historical Tour',
      description: 'Explore the rock-hewn churches of Lalibela, a UNESCO World Heritage site and one of Ethiopia\'s most sacred destinations.',
      price: 850,
      duration: '4 Days / 3 Nights',
      location: 'Lalibela, Amhara',
      highlights: 'Visit all 11 monolithic churches\nWitness traditional Ethiopian Orthodox ceremonies\nExplore local markets and cuisine',
      travelDetails: 'Includes airport transfers, guided tours, accommodation, and daily breakfast.',
      itinerary: [
        { day: 1, title: 'Arrival in Lalibela', description: 'Airport pickup and hotel check-in.' },
        { day: 2, title: 'Northern Cluster Churches', description: 'Guided tour of the northern church group.' },
        { day: 3, title: 'Southern Cluster & St. George', description: 'Visit Biete Ghiorgis and southern churches.' },
        { day: 4, title: 'Departure', description: 'Morning at leisure, transfer to airport.' },
      ],
      imageUrl: '/uploads/lalibela-hero.jpg',
    },
    {
      title: 'Simien Mountains Trek',
      description: 'Trek through dramatic escarpments and spot gelada baboons in the Simien Mountains National Park.',
      price: 1200,
      duration: '6 Days / 5 Nights',
      location: 'Simien Mountains, Amhara',
      highlights: 'Gelada baboon encounters\nPanoramic mountain vistas\nExpert trekking guides',
      travelDetails: 'Camping equipment, park fees, meals, and transport included.',
      itinerary: [
        { day: 1, title: 'Gondar to Sankaber', description: 'Drive to the park and acclimatize.' },
        { day: 2, title: 'Sankaber to Geech', description: 'Trek along the escarpment edge.' },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  // Seed Tours
  for (const tour of tours) {
    await prisma.tour.create({ data: tour });
  }

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