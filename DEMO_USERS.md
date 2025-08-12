# Demo Users for QuickCourt Application

All demo users have been added to the SQLite database with proper bcrypt password hashes and are now fully functional for login and booking.

## 🔐 Demo Login Credentials

### � Admin User
- **Email**: `admin@quickcourt.com`
- **Password**: `Admin123!`
- **Role**: Admin
- **Name**: Admin User
- **Database ID**: 1

### �👨‍💼 Facility Owners
- **Email**: `owner1@quickcourt.com`
- **Password**: `Owner123!`
- **Role**: Facility Owner
- **Name**: Rajesh Kumar
- **Database ID**: 2

---

- **Email**: `owner2@quickcourt.com`
- **Password**: `Owner123!`
- **Role**: Facility Owner
- **Name**: Priya Sharma
- **Database ID**: 3

### 👤 Regular Users
- **Email**: `user1@example.com`
- **Password**: `User123!`
- **Role**: User
- **Name**: Amit Singh
- **Database ID**: 4

---

- **Email**: `user2@example.com`
- **Password**: `User123!`
- **Role**: User
- **Name**: Sneha Patel
- **Database ID**: 5

---

- **Email**: `user3@example.com`
- **Password**: `User123!`
- **Role**: User
- **Name**: Rohit Verma
- **Database ID**: 6

---

- **Email**: `user4@example.com`
- **Password**: `User123!`
- **Role**: User
- **Name**: Arjun Mehta
- **Database ID**: 7

---

- **Email**: `user5@example.com`
- **Password**: `User123!`
- **Role**: User
- **Name**: Kavya Reddy
- **Database ID**: 8

## 🔄 Password Reset Testing

All users support password reset functionality. Simply:

1. Go to `/forgot-password`
2. Enter any of the above email addresses
3. Check your email for the reset link
4. Set a new password
5. Login with the new password

## 🎯 Features Available

- ✅ **Login System**: All users can log in with above credentials
- ✅ **Password Reset**: Forgot password with email verification
- ✅ **Role-based Access**: Different dashboard access based on role
- ✅ **SQLite Integration**: All data stored in `data/quickcourt.db`
- ✅ **Secure Passwords**: bcrypt hashing with 12 salt rounds

## 🚀 Quick Start

1. Start the development server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Use any of the credentials above
4. Explore the application!

---

**Note**: All users are verified and active by default for demo purposes.
