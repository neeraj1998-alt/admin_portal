const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

router.get("/", jobController.getJobs);
router.get("/:id", jobController.getJob);
router.post("/", jobController.createJob);
router.put("/:id", jobController.updateJob);
router.patch("/:id/status", jobController.updateJobStatus);
router.delete("/:id", jobController.deleteJob);

module.exports = router;
