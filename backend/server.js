import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import tourRoutes from './routes/tourRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
  res.send('ANDI TOURS API is running...');
});

app.use('/api/tours', tourRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(errorHandler);

connectDB().catch((error) => {
  console.error('Failed to initialize database connection:', error);
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
