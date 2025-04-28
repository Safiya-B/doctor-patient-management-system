# Doctor-Patient Management System

A full-stack application designed for a doctor (administrator) to interact with their patients.

## 🚀 Features

- **Doctor (Admin) and Patient Dashboards**
  - Secure authentication for doctor (admin) and patient (user) accounts
- **Patient Management**
  - Full CRUD operations for patient profiles (create, read, update, delete)
- **Appointment & Prescription Workflow**
  - Upload and download prescriptions via AWS S3
  - Send invitation and confirmation emails with AWS SES
  - Manage appointments with FullCalendar API (currently non-functional - refactoring)
- **Video Consultation**
  - Integrated with Twilio Video API (currently non-functional - refactoring)
- **Responsive & Accessible UI**
  - Built with React and Material-UI for a mobile-friendly experience

## 🛠️ Tech Stack

- **Frontend**: React, Material-UI (MUI v5, migrating from v4)
- **Backend**: Node.js, Express
- **Database**: MongoDB (with Mongoose)
- **Cloud Services**: AWS S3 (file storage), AWS SES (email notifications)
- **Video API**: Twilio Video

## 🔄 Current Status

> ⚠️ **Work-in-Progress**
>
> - Refactoring codebase for better reusability
> - Upgrading from MUI v4 to MUI v5
> - Rebuilding video consultation and appointment features

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Safiya-B/doctor-patient-management-system
   cd doctor-patient-management-system
   ```
2. **Install dependencies**

   ```bash
   # Backend
   cd server && npm install

   # Frontend
   cd ../client && npm install
   ```

3. **Run the application**

   ```bash
   # In server folder
   npm run dev

   # In client folder
   npm start
   ```
