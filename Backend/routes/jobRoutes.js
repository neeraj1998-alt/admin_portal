const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// Public endpoints (Candidates & Public View)
router.get("/", jobController.getJobs);
router.get("/stats", jobController.getJobStats);
router.get("/:id", jobController.getJob);

// Admin / Recruiter protected endpoints
router.post("/", authMiddleware, authorizeRoles("ADMIN", "RECRUITER"), jobController.createJob);
router.put("/:id", authMiddleware, authorizeRoles("ADMIN", "RECRUITER"), jobController.updateJob);
router.patch("/:id/status", authMiddleware, authorizeRoles("ADMIN", "RECRUITER"), jobController.updateJobStatus);
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN"), jobController.deleteJob);

module.exports = router;
