# ANDI TOURS System Overview

## Purpose

This document explains how the ANDI TOURS web app works, describing the frontend and backend roles, how users and admin interact with the system, and which pages are involved.

---

## System architecture

- Frontend: React app in `frontend/`
- Backend: Express server in `backend/`
- Database: PostgreSQL via Prisma
- Authentication: JWT style user data held in Redux and local storage

---

## User flow

### Public access
Visitors can browse the public website without logging in.

Pages:
- `Home` (`/`) — landing page
- `DestinationsPage` (`/destinations`) — tour listings
- `TourDetail` (`/tour/:id`) — detail page for a single tour
- `Gallery` (`/gallery`) — gallery or stories
- `Contact` (`/contact`) — contact page
- `LoginPage` (`/login`) — login and registration form

### Authentication

Users sign in or register through `frontend/src/pages/LoginPage.jsx`.

- Registered users are stored in Redux state via `frontend/src/features/auth/authSlice.js`
- Successful login saves user data in `localStorage`
- If a user tries to book without being signed in, the app asks them to log in first

### Booking flow

On a tour detail page:
- user views highlights, itinerary, travel details, and booking form
- booking request is sent to backend route `/api/bookings`
- request includes tour ID and user booking details
- user must be authenticated and provide a valid token

### User portal

Authenticated users can manage their bookings and account from `frontend/src/pages/MyBookings.jsx`.

Actions available:
- view existing bookings
- edit a booking
- cancel a booking
- update profile information

---

## Admin flow

### Admin access

Admin area is protected using `frontend/src/components/Protected.jsx`.

- Only signed-in users can access `/admin/*`
- If a user is not authenticated, they are redirected to `/login`

### Admin dashboard

The main admin screen is `frontend/src/pages/AdminDashboard.jsx`.

It contains a sidebar and main content area. The sidebar is implemented in `frontend/src/components/admin/AdminSidebar.jsx`.

Tabs available:
- `Dashboard` — overall stats and summary
- `Packages` — manage tour packages
- `Orders` — manage bookings and orders
- `Users` — manage registered users
- `Stories & Gallery` — manage blog / gallery content
- `Reviews` — manage customer reviews

### Admin responsibilities

The admin controls:
- tour packages and destinations
- bookings/orders management
- user management
- blog/gallery content
- reviews and ratings
- dashboard metrics

---

## Frontend / backend interaction

The frontend uses API endpoints exposed by the backend server in `backend/server.js`.

Main backend routes:
- `/api/tours` — tour data
- `/api/users` — user auth and profile
- `/api/bookings` — booking management
- `/api/blog` — blog/gallery content

The backend also serves uploaded images from `/uploads`.

---

## Key files

- `frontend/src/App.jsx` — app routing and page structure
- `frontend/src/components/Protected.jsx` — auth guard for protected routes
- `frontend/src/pages/AdminDashboard.jsx` — admin page container
- `frontend/src/components/admin/AdminSidebar.jsx` — admin navigation
- `frontend/src/features/auth/authSlice.js` — login/register/logout state
- `frontend/src/pages/MyBookings.jsx` — user booking management
- `frontend/src/pages/TourDetail.jsx` — tour booking and details
- `backend/server.js` — Express server setup and API mounting

---

## Summary

The system is built as a single-page React frontend talking to an Express backend. Users browse tours, authenticate, and manage bookings. Admins use a protected dashboard to manage tours, orders, users, blog content, and reviews.
