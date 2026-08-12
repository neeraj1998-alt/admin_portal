# B1 Backend Handover

## Status

B1 authentication, authorization, dashboard APIs, and backend integration groundwork are complete and verified for the current development stage.

This phase intentionally does not require PostgreSQL to run. The backend uses a mock repository layer for temporary dashboard metrics and keeps the repository boundary isolated so it can later be replaced with PostgreSQL without changing the controller/service architecture.

---

## 1. Files created

- [Projects-/Backend/controllers/dashboardController.js](Projects-/Backend/controllers/dashboardController.js)
- [Projects-/Backend/services/dashboardService.js](Projects-/Backend/services/dashboardService.js)
- [Projects-/Backend/repositories/dashboardRepository.js](Projects-/Backend/repositories/dashboardRepository.js)
- [Projects-/Backend/routes/dashboardRoutes.js](Projects-/Backend/routes/dashboardRoutes.js)
- [Projects-/Backend/middleware/errorMiddleware.js](Projects-/Backend/middleware/errorMiddleware.js)

## 2. Files modified

- [Projects-/Backend/app.js](Projects-/Backend/app.js)
- [Projects-/Backend/config/database.js](Projects-/Backend/config/database.js)
- [Projects-/Backend/routes/authRoutes.js](Projects-/Backend/routes/authRoutes.js)
- [Projects-/Backend/middleware/authMiddleware.js](Projects-/Backend/middleware/authMiddleware.js)
- [Projects-/Backend/middleware/authorizeRoles.js](Projects-/Backend/middleware/authorizeRoles.js)
- [Projects-/Backend/utils/apiResponse.js](Projects-/Backend/utils/apiResponse.js)

---

## 3. B1 API endpoints

### Authentication
- `POST /api/auth/login`
- `GET /api/auth/me`

### Health
- `GET /api/health`

### Dashboard
- `GET /api/dashboard/stats`
- `GET /api/dashboard/recent-jobs`
- `GET /api/dashboard/recent-applications`
- `GET /api/dashboard/application-status`
- `GET /api/dashboard/applications-by-job`

### Security rules
- All dashboard endpoints require authentication.
- Dashboard access is allowed for `ADMIN` and `RECRUITER` roles only.
- Unauthenticated requests are rejected with `401`.
- Unauthorized role access is rejected with `403`.

---

## 4. Authentication flow

1. Client sends `POST /api/auth/login` with email and password.
2. Controller receives the request and delegates to the service layer.
3. Service validates required fields and credentials.
4. Repository checks the admin user record in the mock repository.
5. Password is compared with bcrypt and the account status is checked.
6. JWT is signed with user identity and role information.
7. The client sends the JWT in the `Authorization: Bearer <token>` header.
8. `authMiddleware` validates the token and attaches `req.user`.
9. Protected routes use `authorizeRoles(...)` to enforce access rules.

Relevant files:
- [Projects-/Backend/routes/authRoutes.js](Projects-/Backend/routes/authRoutes.js)
- [Projects-/Backend/controllers/authController.js](Projects-/Backend/controllers/authController.js)
- [Projects-/Backend/services/authService.js](Projects-/Backend/services/authService.js)
- [Projects-/Backend/repositories/adminUserRepository.js](Projects-/Backend/repositories/adminUserRepository.js)
- [Projects-/Backend/middleware/authMiddleware.js](Projects-/Backend/middleware/authMiddleware.js)
- [Projects-/Backend/middleware/authorizeRoles.js](Projects-/Backend/middleware/authorizeRoles.js)
- [Projects-/Backend/utils/jwt.js](Projects-/Backend/utils/jwt.js)

---

## 5. Dashboard flow

Dashboard routes follow the same layered structure:

Controller → Service → Repository → Response

1. Request hits [Projects-/Backend/routes/dashboardRoutes.js](Projects-/Backend/routes/dashboardRoutes.js)
2. `authMiddleware` checks the JWT.
3. `authorizeRoles("ADMIN", "RECRUITER")` restricts access.
4. Controller calls the dashboard service.
5. Service calculates dashboard metrics or fetches recent data.
6. Repository returns the data source output.
7. Response is sent in a consistent API format using the shared response utility.

Metrics included:
- Total Jobs
- Active Jobs
- Total Applications
- New Applications
- Shortlisted Candidates
- Selected Candidates
- Recent Jobs
- Recent Applications
- Application status distribution
- Applications by job

---

## 6. Mock data used

The verified schema currently contains the following tables:
- `jobs`
- `admin_users`

Because Applications and Candidates tables are not yet available, the dashboard uses isolated mock repository data for the metrics that cannot be derived from the verified schema.

This is done in:
- [Projects-/Backend/repositories/dashboardRepository.js](Projects-/Backend/repositories/dashboardRepository.js)

### Real data used
- jobs records from the existing jobs table

### Mock-only data used
- application counts
- recent application list
- application status distribution
- applications grouped by job
- candidate counts such as shortlisted/selected values

This data is clearly temporary and isolated so it can later be replaced by PostgreSQL queries without changing the service/controller structure.

---

## 7. What will change when PostgreSQL is installed

When PostgreSQL is set up, the repository layer becomes the only primary change area.

Expected changes:
- Replace mock repository methods with actual SQL queries in [Projects-/Backend/repositories/dashboardRepository.js](Projects-/Backend/repositories/dashboardRepository.js)
- Use [Projects-/Backend/config/database.js](Projects-/Backend/config/database.js) for DB config
- Keep controller/service code unchanged
- Keep the API contract stable

Important rule:
- Do not put SQL directly in controllers or services.
- Repository remains the boundary between business logic and database logic.

---

## 8. What will change when Applications/Candidates schemas are integrated

When the other developers provide the Applications and Candidates schema, the following should be updated:

- Replace mock application records in the dashboard repository with queries against the real application table
- Replace mock candidate status counts with real join-based results
- Keep the same dashboard endpoint names and response structure
- Keep the UI contract stable for B2/B3 consumers

No dashboard contract changes should be required unless the project team explicitly decides to add more fields.

---

## 9. Testing instructions

### Start the backend

From [Projects-/Backend](Projects-/Backend):

```bash
npm install
npm run dev
```

### Test authentication

Login:

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"development-password"}'
```

Get current user:

```bash
curl http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

### Test dashboard without token

```bash
curl http://localhost:5001/api/dashboard/stats
```

Expected result: `401 Unauthorized`

### Test dashboard with token

```bash
curl http://localhost:5001/api/dashboard/stats \
  -H "Authorization: Bearer <TOKEN>"

curl http://localhost:5001/api/dashboard/recent-jobs \
  -H "Authorization: Bearer <TOKEN>"

curl http://localhost:5001/api/dashboard/recent-applications \
  -H "Authorization: Bearer <TOKEN>"

curl http://localhost:5001/api/dashboard/application-status \
  -H "Authorization: Bearer <TOKEN>"

curl http://localhost:5001/api/dashboard/applications-by-job \
  -H "Authorization: Bearer <TOKEN>"
```

### Validation status

These routes were verified in the current project runtime:
- login returns a valid JWT
- authorized dashboard calls return `200`
- unauthenticated dashboard calls return `401`

---

## 10. Handoff summary

B1 completed the following for the backend:
- authentication and authorization
- role-based access enforcement
- dashboard API layer
- central error handling
- repository-based architecture ready for database replacement
- mock data isolation for currently unavailable applications and candidate ownership data

This is ready for the next backend team member or next phase to integrate with the real PostgreSQL and final application schemas without changing the existing API contract.
