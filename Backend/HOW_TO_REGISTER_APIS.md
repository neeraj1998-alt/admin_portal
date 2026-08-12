# How to Register New APIs in app.js
Read 

Read 

Read 

Read 

Read 

Read , lines 1 to 20

Read 

Read 

Here are all the **APIs currently in your project**:

## 🔐 **Authentication APIs**

### User Auth (General)
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)
- `GET /api/auth/admin-only` - Admin-only example endpoint (requires auth)

### Admin Auth
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/me` - Get current admin (requires auth)
- `POST /api/admin/auth/logout` - Admin logout
- `POST /api/admin/auth/refresh` - Refresh admin token

---

## 💼 **Job Management APIs**

- `GET /api/jobs` - Get all jobs (with pagination & filters)
- `GET /api/jobs/:id` - Get single job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job details
- `PATCH /api/jobs/:id/status` - Update job status
- `DELETE /api/jobs/:id` - Delete job

---

## 📊 **Dashboard APIs** (Recruiter/Admin only)

- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/recent-jobs` - Get recent job listings
- `GET /api/dashboard/recent-applications` - Get recent applications
- `GET /api/dashboard/application-status` - Get application status breakdown
- `GET /api/dashboard/applications-by-job` - Get applications grouped by job

---

## 🏥 **Health Check**

- `GET /health` - Service health status
- `GET /api/health` - Service health status (also available under /api)

---

**Total: 18 Active API Endpoints**

## Step 1: Import the Route
Add this import at the top of `Backend/app.js`:

```javascript
const applicationRoutes = require("./routes/applicationRoutes");
```

## Step 2: Register the Route
Add this middleware registration in `Backend/app.js` (after existing routes):

```javascript
// Application Routes
app.use("/api/applications", applicationRoutes);
```

## Complete Example in app.js
```javascript
const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");  // ← Add this
const errorMiddleware = require("./middleware/errorMiddleware");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);  // ← Add this

// Error handling
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errorMiddleware);

module.exports = app;
```

---

## Setup Instructions

### 1. Create Database Table
Run the SQL migration:
```bash
mysql -u your_user -p your_database < Backend/database/03_applications.sql
```

Or execute it directly in MySQL:
```sql
SOURCE Backend/database/03_applications.sql;
```

### 2. Register Routes
Update `Backend/app.js` with the applicationRoutes import and registration

### 3. Test the APIs

#### Create an application
```bash
curl -X POST "http://localhost:3000/api/applications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "job_id": 1,
    "cover_letter": "I am very interested in this position",
    "resume_url": "https://example.com/resume.pdf"
  }'
```

#### Get all user applications
```bash
curl -X GET "http://localhost:3000/api/applications" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get applications by job (recruiter only)
```bash
curl -X GET "http://localhost:3000/api/applications/job/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update application status (recruiter only)
```bash
curl -X PUT "http://localhost:3000/api/applications/1/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "SHORTLISTED"}'
```

#### Withdraw application
```bash
curl -X DELETE "http://localhost:3000/api/applications/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## API Endpoints Summary

| Method | Endpoint | Description | Requires Auth |
|--------|----------|-------------|---|
| GET | `/api/applications` | Get user's applications | Yes |
| GET | `/api/applications/:id` | Get application details | Yes |
| GET | `/api/applications/job/:jobId` | Get job's applications (recruiter) | Yes |
| POST | `/api/applications` | Create new application | Yes |
| PUT | `/api/applications/:id/status` | Update status (recruiter) | Yes |
| DELETE | `/api/applications/:id` | Withdraw application | Yes |

---

## Response Examples

### GET /api/applications (Success)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "job_id": 1,
      "user_id": 2,
      "status": "PENDING",
      "cover_letter": "I am very interested in this role.",
      "resume_url": "https://example.com/resume.pdf",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### POST /api/applications (Error - Already Applied)
```json
{
  "success": false,
  "message": "You have already applied to this job",
  "statusCode": 400
}
```

---

## Next Steps

1. ✅ Create the database table using 03_applications.sql
2. ✅ Register the routes in app.js
3. ✅ Test the endpoints with the cURL commands above
4. Create similar APIs for:
   - User profiles
   - Candidate management
   - Search & filtering
   - Admin user management
