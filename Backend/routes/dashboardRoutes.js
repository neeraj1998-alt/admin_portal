const express = require("express");
const {
  getDashboardStats,
  getRecentJobs,
  getRecentApplications,
  getApplicationStatus,
  getApplicationsByJob,
} = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeRoles");

const router = express.Router();

router.get("/dashboard/stats", authMiddleware, authorizeRoles("ADMIN", "RECRUITER"), getDashboardStats);
router.get("/dashboard/recent-jobs", authMiddleware, authorizeRoles("ADMIN", "RECRUITER"), getRecentJobs);
router.get("/dashboard/recent-applications", authMiddleware, authorizeRoles("ADMIN", "RECRUITER"), getRecentApplications);
router.get("/dashboard/application-status", authMiddleware, authorizeRoles("ADMIN", "RECRUITER"), getApplicationStatus);
router.get("/dashboard/applications-by-job", authMiddleware, authorizeRoles("ADMIN", "RECRUITER"), getApplicationsByJob);

module.exports = router;
