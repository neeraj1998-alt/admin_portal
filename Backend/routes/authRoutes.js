const express = require("express");
const {
  login,
  getCurrentUser,
  adminOnlyExample,
  getAllUsers,
  createAdminUser,
  updateUserStatus,
  changePassword,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeRoles");

const router = express.Router();

router.post("/auth/login", login);
router.get("/auth/me", authMiddleware, getCurrentUser);
router.get("/auth/admin-only", authMiddleware, authorizeRoles("ADMIN"), adminOnlyExample);
router.post("/auth/change-password", authMiddleware, changePassword);

// Admin Users Management endpoints
router.get("/auth/users", authMiddleware, authorizeRoles("ADMIN"), getAllUsers);
router.post("/auth/users", authMiddleware, authorizeRoles("ADMIN"), createAdminUser);
router.patch("/auth/users/:id/status", authMiddleware, authorizeRoles("ADMIN"), updateUserStatus);

module.exports = router;
