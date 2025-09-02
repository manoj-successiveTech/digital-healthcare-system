# HealthcarePro Backend - Complete API Routes List

**Base URL:** `http://localhost:5000`  
**Server Status:** ✅ Running on Port 5000  
**Database:** MongoDB (healthcarepro)

---

## 🔐 Authentication Routes

**Base Path:** `/api/auth`

### Public Routes (No Authentication Required)

| Method | Route                | Full URL                                  | Description                                |
| ------ | -------------------- | ----------------------------------------- | ------------------------------------------ |
| `POST` | `/api/auth/register` | `http://localhost:5000/api/auth/register` | Register new user (patient, doctor, admin) |
| `POST` | `/api/auth/login`    | `http://localhost:5000/api/auth/login`    | User login and get JWT token               |

### Protected Routes (Authentication Required)

| Method | Route                       | Full URL                                         | Description              |
| ------ | --------------------------- | ------------------------------------------------ | ------------------------ |
| `GET`  | `/api/auth/profile`         | `http://localhost:5000/api/auth/profile`         | Get current user profile |
| `PUT`  | `/api/auth/profile`         | `http://localhost:5000/api/auth/profile`         | Update user profile      |
| `PUT`  | `/api/auth/change-password` | `http://localhost:5000/api/auth/change-password` | Change user password     |
| `POST` | `/api/auth/logout`          | `http://localhost:5000/api/auth/logout`          | Logout user              |
| `GET`  | `/api/auth/verify`          | `http://localhost:5000/api/auth/verify`          | Verify JWT token         |

---

## 👥 User Management Routes

**Base Path:** `/api/users`

### General User Routes (Authentication Required)

| Method | Route                    | Full URL                                      | Access           | Description                  |
| ------ | ------------------------ | --------------------------------------------- | ---------------- | ---------------------------- |
| `GET`  | `/api/users/doctors`     | `http://localhost:5000/api/users/doctors`     | All Users        | Get list of all doctors      |
| `GET`  | `/api/users/patients`    | `http://localhost:5000/api/users/patients`    | Doctors & Admins | Get list of all patients     |
| `GET`  | `/api/users/:id`         | `http://localhost:5000/api/users/:id`         | Restricted       | Get user by ID               |
| `GET`  | `/api/users/departments` | `http://localhost:5000/api/users/departments` | All Users        | Get medical departments list |

### Admin-Only Routes

| Method | Route                       | Full URL                                         | Access     | Description             |
| ------ | --------------------------- | ------------------------------------------------ | ---------- | ----------------------- |
| `PUT`  | `/api/users/:id/deactivate` | `http://localhost:5000/api/users/:id/deactivate` | Admin Only | Deactivate user account |
| `PUT`  | `/api/users/:id/activate`   | `http://localhost:5000/api/users/:id/activate`   | Admin Only | Activate user account   |

---

## 📅 Appointment Routes

**Base Path:** `/api/appointments`

### General Appointment Routes (Authentication Required)

| Method   | Route                   | Full URL                                     | Access        | Description                              |
| -------- | ----------------------- | -------------------------------------------- | ------------- | ---------------------------------------- |
| `GET`    | `/api/appointments`     | `http://localhost:5000/api/appointments`     | All Users     | Get appointments (filtered by user role) |
| `POST`   | `/api/appointments`     | `http://localhost:5000/api/appointments`     | Patients Only | Create new appointment                   |
| `GET`    | `/api/appointments/:id` | `http://localhost:5000/api/appointments/:id` | Related Users | Get appointment by ID                    |
| `PUT`    | `/api/appointments/:id` | `http://localhost:5000/api/appointments/:id` | Related Users | Update appointment                       |
| `DELETE` | `/api/appointments/:id` | `http://localhost:5000/api/appointments/:id` | Related Users | Cancel appointment                       |

### Special Appointment Routes

| Method | Route                                         | Full URL                                                           | Access           | Description                         |
| ------ | --------------------------------------------- | ------------------------------------------------------------------ | ---------------- | ----------------------------------- |
| `GET`  | `/api/appointments/stats`                     | `http://localhost:5000/api/appointments/stats`                     | Doctors & Admins | Get appointment statistics          |
| `GET`  | `/api/appointments/available-slots/:doctorId` | `http://localhost:5000/api/appointments/available-slots/:doctorId` | All Users        | Get available time slots for doctor |

---

## 📊 Dashboard Routes

**Base Path:** `/api/dashboard`

| Method | Route                       | Full URL                                         | Access    | Description                      |
| ------ | --------------------------- | ------------------------------------------------ | --------- | -------------------------------- |
| `GET`  | `/api/dashboard`            | `http://localhost:5000/api/dashboard`            | All Users | Get role-specific dashboard data |
| `GET`  | `/api/dashboard/stats`      | `http://localhost:5000/api/dashboard/stats`      | All Users | Get user statistics              |
| `GET`  | `/api/dashboard/activities` | `http://localhost:5000/api/dashboard/activities` | All Users | Get recent activities            |

---

## 🏠 General Routes

| Method | Route | Full URL                 | Description                       |
| ------ | ----- | ------------------------ | --------------------------------- |
| `GET`  | `/`   | `http://localhost:5000/` | Server status and API information |

---

## 📝 Complete Routes Summary

### Total Routes: 22

#### By Category:

- **Authentication Routes:** 7 endpoints
- **User Management Routes:** 6 endpoints
- **Appointment Routes:** 7 endpoints
- **Dashboard Routes:** 3 endpoints
- **General Routes:** 1 endpoint

#### By HTTP Method:

- **GET:** 13 routes
- **POST:** 4 routes
- **PUT:** 4 routes
- **DELETE:** 1 route

#### By Access Level:

- **Public:** 2 routes (register, login)
- **All Authenticated Users:** 12 routes
- **Patients Only:** 1 route
- **Doctors & Admins:** 3 routes
- **Admin Only:** 2 routes
- **Related Users Only:** 3 routes

---

## 🔧 Testing Examples

### 1. Test Server Status

```bash
curl http://localhost:5000/
```

### 2. Login as Admin

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@healthcarepro.com","password":"admin123456"}'
```

### 3. Get All Doctors

```bash
curl -X GET http://localhost:5000/api/users/doctors \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Create Appointment (Patient)

```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"doctor":"DOCTOR_ID","appointmentDate":"2025-09-10","timeSlot":{"start":"10:00","end":"10:30"},"reason":"Regular checkup"}'
```

### 5. Get Dashboard Data

```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔑 Authentication

Most routes require JWT token authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Admin Credentials for Testing:

- **Email:** `admin@healthcarepro.com`
- **Password:** `admin123456`
- **User Type:** `admin`

---

## 📊 Query Parameters

### Pagination (where applicable):

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Filtering:

- `search`: Search term for name/email filtering
- `department`: Filter doctors by department
- `status`: Filter appointments by status
- `date`: Filter by specific date

### Example with Query Parameters:

```
http://localhost:5000/api/users/doctors?department=Cardiology&page=1&limit=5
```

---

## 🚀 Quick Start

1. **Start Backend Server:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Test Server:**

   ```bash
   curl http://localhost:5000/
   ```

3. **Login and Get Token:**

   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@healthcarepro.com","password":"admin123456"}'
   ```

4. **Use Token for Protected Routes:**
   ```bash
   curl -X GET http://localhost:5000/api/dashboard \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

---

**Last Updated:** September 2, 2025  
**Server Version:** 1.0.0  
**Port:** 5000
