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

module.exports = {
  login,
  getCurrentUser,
  adminOnlyExample,
};
