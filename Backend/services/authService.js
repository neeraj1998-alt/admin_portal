const bcrypt = require("bcryptjs");
const adminUserRepository = require("../repositories/adminUserRepository");
const { generateToken } = require("../utils/jwt");

const login = async ({ email, password }) => {
  if (!email) {
    const error = new Error("Email is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!password) {
    const error = new Error("Password is required.");
    error.statusCode = 400;
    throw error;
  }

  const user = await adminUserRepository.findByEmail(email);

  if (!user) {
    const error = new Error("Invalid credentials.");
    error.statusCode = 401;
    throw error;
  }

  if (user.account_status !== "ACTIVE") {
    const error = new Error("Account is inactive.");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    const error = new Error("Invalid credentials.");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    account_status: user.account_status,
    first_name: user.first_name,
    last_name: user.last_name,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      account_status: user.account_status,
      first_name: user.first_name,
      last_name: user.last_name,
    },
  };
};

const getAllUsers = async () => {
  return await adminUserRepository.findAll();
};

const createAdminUser = async (userData) => {
  const { email, password, role, first_name, last_name } = userData;
  if (!email) {
    const error = new Error("Email is required.");
    error.statusCode = 400;
    throw error;
  }

  const existing = await adminUserRepository.findByEmail(email);
  if (existing) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  return await adminUserRepository.createAdminUser({ email, password, role, first_name, last_name });
};

const updateUserStatus = async (id, status) => {
  const user = await adminUserRepository.updateAdminUserStatus(id, status);
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword) {
    const error = new Error("Current password is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!newPassword || newPassword.length < 6) {
    const error = new Error("New password must be at least 6 characters long.");
    error.statusCode = 400;
    throw error;
  }

  const user = await adminUserRepository.findById(userId);
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  const isCurrentValid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isCurrentValid) {
    const error = new Error("Current password is incorrect.");
    error.statusCode = 400;
    throw error;
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await adminUserRepository.updatePassword(userId, newHash);

  return { message: "Password updated successfully." };
};

module.exports = {
  login,
  getAllUsers,
  createAdminUser,
  updateUserStatus,
  changePassword,
};
