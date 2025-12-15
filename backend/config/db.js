// backend/config/db.js

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Mongoose connects using the variable from our .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit the process with failure
    }
};

export default connectDB;