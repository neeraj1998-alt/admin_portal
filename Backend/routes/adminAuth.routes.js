const express = require("express");
const { loginAdmin, logoutAdmin, getCurrentAdmin, refreshAdminToken } = require("../controllers/adminAuth.controller");
const { validateRequest } = require("../middleware/validateRequest");
const { authenticateAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/admin/auth/login",
  validateRequest({
    required: ["email", "password"],
    fields: {
      email: { type: "email", required: true },
      password: { type: "string", required: true, minLength: 8 },
    },
  }),
  loginAdmin
);

router.post("/admin/auth/logout", logoutAdmin);

router.get("/admin/auth/me", authenticateAdmin, getCurrentAdmin);

router.post("/admin/auth/refresh", refreshAdminToken);

module.exports = router;
