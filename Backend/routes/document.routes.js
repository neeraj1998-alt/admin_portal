const express = require("express");
const documentController = require("../controllers/document.controller");

const router = express.Router();

router.get("/:id", documentController.getDocumentById);
router.get("/:id/download", documentController.downloadDocument);

module.exports = router;
