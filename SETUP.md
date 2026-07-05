# Andi Tours - Setup Guide

This document provides instructions for setting up the Andi Tours React/Express application with Prisma and PostgreSQL.

## Features Implemented

### 1. Admin to User Content Flow
- ✅ Admin can create tour packages with Highlights, Itinerary (Day-by-Day), and Travel Details
- ✅ Packages display as beautiful cards on the Destinations page
- ✅ Tour Detail page with 3-Tab Navigation (Highlights | Itinerary | Travel Details)

### 2. User to Admin Transaction Flow
- ✅ Booking form with all required fields (Full Name, Phone, Email, Number of Tourists, Date Range, Comments)
- ✅ Bookings stored in PostgreSQL via Prisma
- ✅ Admin Orders section with real-time booking display
- ✅ Notification badges for new and updated bookings

### 3. User Account Logic
- ✅ Navbar transformation: Login → My Account (after login)
- ✅ My Account section with:
  - Manage Account: Update profile and contact details
  - My Bookings: View booking history, status, and update bookings
- ✅ Update notifications sent to admin when users modify bookings

### 4. Technical Standards
- ✅ Environment variables for API URLs (ready for cloud deployment)
- ✅ React state management for tab switching and conditional Navbar rendering
- ✅ Prisma models and schema for data integrity

## Environment Variables Setup

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/anditours
PORT=8000
NODE_ENV=development
ADMIN_EMAIL=admin@anditours.com
```

**For Production:**
```env
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
PORT=8000
NODE_ENV=production
ADMIN_EMAIL=admin@anditours.com
```

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```

**For Production:**
```env
VITE_API_URL=https://your-backend-api.com
```

**Note:** In development mode, the Vite proxy will handle API calls to `/api`, so `VITE_API_URL` can be left empty or set to your backend URL. In production, it must be set to your deployed backend URL.

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (local or hosted, such as Supabase)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration (see above)

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:8000` (or the port specified in `.env`)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration (see above)

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite default port)

## Database Models

### Tour Model
- name, price, duration, description
- highlights (string)
- travelDetails (string)
- itinerary (array of day objects with day, title, description)
- imageUrl, status

### Booking Model
- user (reference to User)
- tour (reference to Tour)
- fullName, phone, email
- numberOfTourists
- dateFrom, dateTo
- comments
- status (pending/confirmed/cancelled)
- isNew, isUpdated, lastUpdatedAt (for notifications)

### User Model
- name, email, password
- role (client/admin)

## API Endpoints

### Public Routes
- `GET /api/tours` - Get all tours
- `GET /api/tours/active` - Get active tours only
- `GET /api/tours/:id` - Get single tour
- `POST /api/users` - Register user
- `POST /api/users/login` - Login user

### Protected Routes (User)
- `GET /api/bookings/mybookings` - Get user's bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Protected Routes (Admin)
- `POST /api/tours` - Create tour
- `PUT /api/tours/:id` - Update tour
- `DELETE /api/tours/:id` - Delete tour
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/stats` - Get booking statistics
- `PUT /api/bookings/:id` - Update booking (including status)

## Deployment

### Backend Deployment (Render/Vercel/Heroku)
1. Set environment variables in your hosting platform
2. Ensure the PostgreSQL connection string is correct
3. Deploy and note the backend URL

### Frontend Deployment (Vercel/Netlify)
1. Set `VITE_API_URL` to your deployed backend URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder

## Key Features Implementation

### Tab Navigation
The Tour Detail page uses React state (`useState`) to manage active tab switching between Highlights, Itinerary, and Travel Details.

### Navbar Transformation
The Navbar component uses Redux to check authentication state. When a user logs in, it displays "My Account" instead of "Login".

### Booking Notifications
- New bookings are marked with `isNew: true`
- Updated bookings are marked with `isUpdated: true`
- Admin Orders page displays badges showing counts of new and updated bookings
- Auto-refreshes every 30 seconds to catch new bookings

### Update Notifications
When a user updates their booking, the system:
1. Sets `isUpdated: true`
2. Sets `isNew: false`
3. Records `lastUpdatedAt` timestamp
4. Admin sees the update badge in the Orders section

## Notes

- All API calls use environment variables for URLs
- In development, Vite proxy handles `/api` routes
- In production, use full URLs with `VITE_API_URL`
- JWT tokens are stored in localStorage
- Password hashing uses bcryptjs
- All dates are stored as DateTime values in PostgreSQL


