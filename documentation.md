# HealthcarePro System - Project Overview

## Purpose
HealthcarePro is a healthcare management system designed to streamline and digitize hospital operations for administrators, doctors, and patients. It provides secure, role-based access to essential healthcare features and data.

## Key Features
- **User Management:** Admins can add, activate, deactivate, and manage doctors and patients. Doctors and patients can register and manage their own profiles.
- **Authentication:** Secure login and registration for all user types (admin, doctor, patient) with JWT-based authentication.
- **Dashboards:** Role-specific dashboards for admin, doctor, and patient, showing relevant data and actions.
- **Appointment Booking:** Patients can book appointments with doctors, view status, and track history. Doctors can confirm and manage appointments.

## Technologies Used
- **Backend:** Node.js, Express, MongoDB, JWT, Joi, Helmet, Mongoose
- **Frontend:** Next.js, React, modern UI/UX components
- **Security:** Password hashing, input validation, rate limiting, CORS
