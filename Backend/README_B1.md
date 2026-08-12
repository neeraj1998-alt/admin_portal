# B1 Backend – Authentication & Dashboard

## Overview

This document describes the work completed by **Backend Developer 1 (B1)** for the Admin Recruitment Portal.

B1 is responsible for:

- Admin authentication
- JWT-based authorization
- Role-based access control
- Admin profile/current-user API
- Dashboard APIs
- Common backend middleware
- Repository-based backend architecture
- Preparing the backend for future PostgreSQL integration

---

# 1. B1 Responsibilities

The B1 backend work is divided into two major areas:

```text
B1
│
├── Phase 1
│   ├── Authentication
│   ├── JWT
│   ├── Authorization
│   ├── Role Management
│   └── Current User
│
└── Phase 2
    ├── Dashboard APIs
    ├── Common Middleware
    ├── Error Handling
    └── Database-ready Architecture

    ## API list created in the backend

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

### Protected route behavior
- All dashboard routes require authentication via the existing auth middleware.
- Dashboard access is allowed for `ADMIN` and `RECRUITER` roles only.

### Route files
- authRoutes.js
- dashboardRoutes.js
- health.routes.js

### Notes
- The auth endpoints were already in place and kept intact.
- The dashboard endpoints were added as part of the Phase 2 backend setup.
- All dashboard endpoints are protected and reject unauthenticated requests with `401`.