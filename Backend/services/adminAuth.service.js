const { generateToken } = require("../utils/jwt");
const { findAdminByEmail, findAdminById } = require("../repositories/adminAuth.repository");

const loginAdmin = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email and password are required.");
    error.statusCode = 400;
    throw error;
  }

  const isDatabaseReady = false;

  if (!isDatabaseReady) {
    const error = new Error("Admin authentication is not yet connected to the database. Schema and table details are pending.");
    error.statusCode = 501;
    throw error;
  }

  const admin = await findAdminByEmail(email);

  if (!admin) {
    const error = new Error("Invalid admin credentials.");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({ id: admin.id, email: admin.email, role: admin.role || "admin" });

  return {
    message: "Admin login successful.",
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      role: admin.role || "admin",
    },
  };
};

const logoutAdmin = async (payload = {}) => {
  return {
    message: "Admin logout successful.",
    payload,
  };
};

const getCurrentAdmin = async (admin = null) => {
  if (!admin) {
    const error = new Error("Admin identity is missing.");
    error.statusCode = 401;
    throw error;
  }

  return {
    admin,
  };
};

const refreshAdminToken = async ({ refreshToken } = {}) => {
  if (!refreshToken) {
    const error = new Error("Refresh token is required.");
    error.statusCode = 400;
    throw error;
  }

  const error = new Error("Refresh token flow is not yet implemented. Database and token strategy still pending.");
  error.statusCode = 501;
  throw error;
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  refreshAdminToken,
};
