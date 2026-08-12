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

router.use(authMiddleware);

router.get("/dashboard/stats", authorizeRoles("ADMIN", "RECRUITER"), getDashboardStats);
router.get("/dashboard/recent-jobs", authorizeRoles("ADMIN", "RECRUITER"), getRecentJobs);
router.get("/dashboard/recent-applications", authorizeRoles("ADMIN", "RECRUITER"), getRecentApplications);
router.get("/dashboard/application-status", authorizeRoles("ADMIN", "RECRUITER"), getApplicationStatus);
router.get("/dashboard/applications-by-job", authorizeRoles("ADMIN", "RECRUITER"), getApplicationsByJob);

module.exports = router;
