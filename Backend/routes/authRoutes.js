const express = require("express");
const { login, getCurrentUser, adminOnlyExample } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeRoles");

const router = express.Router();

router.post("/auth/login", login);
router.get("/auth/me", authMiddleware, getCurrentUser);
router.get("/auth/admin-only", authMiddleware, authorizeRoles("ADMIN"), adminOnlyExample);

module.exports = router;
