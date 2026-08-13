const { successResponse } = require("../utils/apiResponse");
const authService = require("../services/authService");

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json(successResponse(result));
  } catch (error) {
    return next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      account_status: req.user.account_status,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
    };

    return res.status(200).json(successResponse(user));
  } catch (error) {
    return next(error);
  }
};

const adminOnlyExample = async (req, res, next) => {
  try {
    const user = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      account_status: req.user.account_status,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
    };

    return res.status(200).json(successResponse({
      message: "Admin access granted.",
      user,
    }));
  } catch (error) {
    return next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    return res.status(200).json(successResponse(users));
  } catch (error) {
    return next(error);
  }
};

const createAdminUser = async (req, res, next) => {
  try {
    const newUser = await authService.createAdminUser(req.body);
    return res.status(201).json(successResponse(newUser));
  } catch (error) {
    return next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await authService.updateUserStatus(id, status);
    return res.status(200).json(successResponse(updated));
  } catch (error) {
    return next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(userId, currentPassword, newPassword);
    return res.status(200).json(successResponse(result));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  login,
  getCurrentUser,
  adminOnlyExample,
  getAllUsers,
  createAdminUser,
  updateUserStatus,
  changePassword,
};
