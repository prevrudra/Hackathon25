# 🏸 QuickCourt - Sports Venue Booking Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3.0-green?style=flat-square&logo=sqlite)](https://www.sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

A modern, full-stack sports venue booking platform built with Next.js, TypeScript, and SQLite. QuickCourt enables users to discover, book, and manage sports facilities while providing comprehensive management tools for facility owners.

## ✨ Features

### 🎯 For Players
- **Smart Venue Discovery** - Browse and search sports facilities by location and sport type
- **Real-time Booking** - Instant court reservations with live availability
- **Multi-Sport Support** - Badminton, Tennis, Football, Basketball, Cricket, and more
- **Booking Management** - Track past and upcoming reservations
- **Reviews & Ratings** - Share experiences and read community feedback
- **Secure Authentication** - Fast OTP-based login with password reset

### 🏢 For Facility Owners
- **Comprehensive Dashboard** - Real-time analytics and performance metrics
- **Revenue Tracking** - Monthly earnings, payment status, and financial insights
- **Booking Management** - Complete reservation oversight with customer details
- **Facility Analytics** - Court occupancy rates and peak hour analysis
- **Multi-venue Support** - Manage multiple facilities from one account

### 👨‍💼 For Administrators
- **User Management** - Complete user account administration
- **Platform Analytics** - System-wide performance and usage statistics
- **Content Moderation** - Review management and quality control

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hackathon25
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🎮 Demo Credentials

#### Admin Access
- **Email**: `admin@quickcourt.com`
- **Password**: `Admin123!`

#### Facility Owners
- **Rajesh Kumar**: `owner1@quickcourt.com` / `Owner123!`
- **Priya Sharma**: `owner2@quickcourt.com` / `Owner123!`

#### Regular Users
- **Amit Singh**: `user1@example.com` / `User123!`
- **Sneha Patel**: `user2@example.com` / `User123!`
- **Rohit Verma**: `user3@example.com` / `User123!`

## 🏗️ Tech Stack

### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management with validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **SQLite** - Lightweight, embedded database
- **Better SQLite3** - High-performance SQLite driver
- **bcryptjs** - Password hashing
- **JWT** - Secure authentication tokens

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

## 📊 Database Schema

The application uses SQLite with the following core tables:

- **users** - User accounts and authentication
- **venues** - Sports facility information
- **courts** - Individual courts within venues
- **bookings** - Reservation transactions
- **reviews** - User feedback and ratings
- **time_slots** - Available booking slots
- **otps** - One-time password management
- **password_resets** - Password recovery tokens

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="./data/quickcourt.db"

# Authentication
JWT_SECRET="your-jwt-secret-key"

# Email (Optional)
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-email"
SMTP_PASS="your-password"
```

### Database Setup
The SQLite database is automatically created and seeded with sample data on first run. No manual setup required!

**Database Location**: `./data/quickcourt.db`

## 📱 Key Pages

- **`/`** - Homepage with venue discovery
- **`/login`** - User authentication
- **`/signup`** - User registration
- **`/venues`** - Browse all venues
- **`/dashboard`** - User dashboard
- **`/my-bookings`** - User booking history
- **`/owner/dashboard`** - Facility owner analytics
- **`/admin`** - Administrative panel

## 🧪 Testing

### Test Pages
- **`/database-test`** - Database integration testing
- **`/quick-test`** - Development utilities

### Running Tests
```bash
npm run test
# or
yarn test
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npx vercel
```

The application is optimized for deployment on Vercel with zero configuration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">
  <strong>QuickCourt</strong> - Your favorite sports booking platform
  <br>
  Made with ❤️ for the sports community
</div>
