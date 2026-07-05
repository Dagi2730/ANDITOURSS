// backend/config/db.js

import prisma from '../lib/prisma.js';

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL connected via Prisma');
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;