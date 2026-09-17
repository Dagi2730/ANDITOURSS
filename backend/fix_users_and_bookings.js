import prisma from './lib/prisma.js';

async function main() {
  console.log('--- Fixing Database Users & Bookings ---');

  // 1. Find Admin user
  let admin = await prisma.user.findUnique({ where: { email: 'admin@anditours.com' } });
  if (admin) {
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        name: 'Andi Tours Admin',
        phone: '+251900000000',
        role: 'ADMIN',
      },
    });
    console.log('Restored Admin user details (Andi Tours Admin)');
  }

  // 2. Find or create Dagi user
  const dagiEmail = 'dagmawitandargachew@gmail.com';
  let dagiUser = await prisma.user.findUnique({ where: { email: dagiEmail } });
  if (!dagiUser) {
    dagiUser = await prisma.user.create({
      data: {
        email: dagiEmail,
        name: 'Dagi',
        phone: '+251946347779',
        password: 'guest_pwd_' + Math.random().toString(36).slice(-8),
        role: 'USER',
      },
    });
    console.log('Created user record for Dagi:', dagiEmail);
  } else {
    await prisma.user.update({
      where: { id: dagiUser.id },
      data: {
        name: 'Dagi',
        phone: '+251946347779',
      },
    });
    console.log('Updated user record for Dagi:', dagiEmail);
  }

  // 3. Reassign any existing bookings created under admin user to Dagi user
  if (admin && dagiUser) {
    const updatedBookings = await prisma.booking.updateMany({
      where: { userId: admin.id },
      data: { userId: dagiUser.id },
    });
    console.log(`Reassigned ${updatedBookings.count} booking(s) to Dagi (${dagiEmail})`);
  }

  const allUsers = await prisma.user.findMany({ select: { id: true, name: true, email: true, phone: true, role: true } });
  console.log('Current Users in DB:', JSON.stringify(allUsers, null, 2));

  const allBookings = await prisma.booking.findMany({
    include: { user: { select: { id: true, name: true, email: true, phone: true } } }
  });
  console.log('Current Bookings in DB:', JSON.stringify(allBookings, null, 2));
}

main()
  .catch((e) => console.error('Error fixing database:', e))
  .finally(async () => await prisma.$disconnect());
