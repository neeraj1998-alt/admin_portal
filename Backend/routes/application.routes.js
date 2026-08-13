const express = require("express");
const applicationController = require("../controllers/application.controller");
const documentController = require("../controllers/document.controller");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

// Application Endpoints
router.get("/", applicationController.getAllApplications);
router.get("/:id", applicationController.getApplicationById);
router.post("/", applicationController.createApplication);
router.patch("/:id/status", applicationController.updateApplicationStatus);

// Nested Documents Endpoints under /api/applications
router.get("/:applicationId/documents", documentController.getDocumentsByApplication);
router.post("/:applicationId/documents", upload.single("file"), documentController.uploadDocument);

module.exports = router;
