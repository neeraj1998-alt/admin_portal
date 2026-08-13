const express = require("express");
const candidateController = require("../controllers/candidate.controller");

const router = express.Router();

router.get("/", candidateController.getAllCandidates);
router.get("/:id", candidateController.getCandidateById);
router.post("/", candidateController.createCandidate);
router.patch("/:id", candidateController.updateCandidate);
router.delete("/:id", candidateController.deleteCandidate);

module.exports = router;
