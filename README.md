# S.V.V. Clinic - Backend API

Backend REST API for S.V.V. Clinic built with Node.js, Express, and MongoDB (Mongoose).

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas via Mongoose
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **Security & Utilities**: CORS, Morgan logger, dotenv

---

## Quick Start

### 1. Install Dependencies
```bash
cd svv-backend
npm install
```

### 2. Environment Configuration
Check `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://kumar:123@cluster0.pfy1jrd.mongodb.net/svv-clinic
JWT_SECRET=svv_clinic_jwt_secret_key_2026_secure
CLIENT_ORIGIN=http://localhost:5173,http://localhost:3000
```

> **Important MongoDB Atlas Setup**:
> If you encounter a `MongooseServerSelectionError` / connection timeout:
> 1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
> 2. Go to **Security** -> **Network Access**.
> 3. Click **Add IP Address**.
> 4. Select **Allow Access From Anywhere** (`0.0.0.0/0`) or add your current public IP address.
> 5. Wait 1-2 minutes for the rule to become active.

### 3. Run the Server
- Development mode (auto-reload on save):
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```
- Seed Doctors Data:
  ```bash
  npm run seed
  ```

---

## API Endpoints

### Health Check
- `GET /api/health` - Check API and MongoDB connection status.

### Appointments (`/api/appointments`)
- `POST /api/appointments` - Book a new appointment request
  - **Body**:
    ```json
    {
      "name": "Ravi Kumar",
      "mobile": "9876543210",
      "doctor": "Dr. S. Karunakar",
      "date": "2026-11-01",
      "time": "11:30",
      "reason": "Routine health checkup"
    }
    ```
- `GET /api/appointments` - List all appointments (Supports query filters: `?status=pending&date=2026-11-01&page=1&limit=20`)
- `GET /api/appointments/stats` - Summary counts (total, today's count, pending, confirmed, completed)
- `GET /api/appointments/:id` - Get appointment details by ID
- `PATCH /api/appointments/:id/status` - Update status (`pending`, `confirmed`, `completed`, `cancelled`) and staff notes
  - **Body**:
    ```json
    {
      "status": "confirmed",
      "notes": "Patient called and confirmed slot"
    }
    ```
- `DELETE /api/appointments/:id` - Cancel / delete appointment

### Doctors (`/api/doctors`)
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get doctor by ID or slug
- `POST /api/doctors` - Add new doctor (Protected, Admin only)
- `PUT /api/doctors/:id` - Update doctor details (Protected, Admin only)
- `DELETE /api/doctors/:id` - Delete doctor (Protected, Admin only)

### Contact / Inquiries (`/api/contacts`)
- `POST /api/contacts` - Submit contact inquiry message
- `GET /api/contacts` - List contact messages (Staff/Admin)
- `PATCH /api/contacts/:id/status` - Mark as read / resolved

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a staff / admin account
- `POST /api/auth/login` - Login with email & password, returns JWT token
- `GET /api/auth/me` - Get current authenticated user (Requires Bearer token)
