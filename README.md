# 🌍 Andi Tours - Travel & Booking Platform

A full-stack travel management platform that enables tourists to explore Ethiopian tour packages, read travel blogs, and book trips, while offering a comprehensive Admin Dashboard to manage packages, bookings, users, and gallery content.

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite), React Router, Axios, CSS (Glassmorphism UI)
- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL) via `@supabase/supabase-js`
- **Authentication:** JWT / Supabase Auth

---

## ✨ Features

### 👤 User / Tourist Side
- **Interactive Tour Browsing:** View active travel packages with high-visibility search & instant loading.
- **Detailed Package Cards:** Explore comprehensive package details featuring **Highlights**, **Itinerary**, and **Travel Details**.
- **Online Booking System:** Easy booking form collecting dates, tourist count, contact info, and special comments.
- **User Authentication:** Sign up, log in, and manage account details seamlessly.
- **My Bookings Dashboard:** Track booking statuses (`Pending`, `Confirmed`).
- **Interactive Contact Page:** Two-column glassmorphism layout to reach the Andi Tours team directly.
- **Travel Blog & Gallery:** View stories and photos posted by the admin.

### 🛡️ Admin Dashboard
- **Package Management (CRUD):** Add, edit, view, and delete tour packages with daily itineraries.
- **Booking Management:** Review incoming bookings, track stats, and update order statuses.
- **User Management:** Oversee client accounts and permissions.
- **Blog & Gallery Control:** Upload photos and stories that sync automatically with the user gallery.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- A [Supabase](https://supabase.com/) project set up with the required tables (`tours`, `bookings`, `blogs`, `users`).

---

### 📂 Installation & Setup

#### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/andi-tours.git](https://github.com/your-username/andi-tours.git)
cd andi-tours
```
