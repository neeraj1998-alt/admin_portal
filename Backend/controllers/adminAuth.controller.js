const { successResponse } = require("../utils/apiResponse");
const { loginAdmin: loginAdminService, logoutAdmin: logoutAdminService, getCurrentAdmin: getCurrentAdminService, refreshAdminToken: refreshAdminTokenService } = require("../services/adminAuth.service");

const loginAdmin = async (req, res, next) => {
  try {
    const result = await loginAdminService(req.body);
    return res.status(200).json(successResponse(result));
  } catch (error) {
    return next(error);
  }
};

const logoutAdmin = async (req, res, next) => {
  try {
    const result = await logoutAdminService(req.body || {});
    return res.status(200).json(successResponse(result));
  } catch (error) {
    return next(error);
  }
};

const getCurrentAdmin = async (req, res, next) => {
  try {
    const result = await getCurrentAdminService(req.admin);
    return res.status(200).json(successResponse(result));
  } catch (error) {
    return next(error);
  }
};

const refreshAdminToken = async (req, res, next) => {
  try {
    const result = await refreshAdminTokenService(req.body || {});
    return res.status(200).json(successResponse(result));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  refreshAdminToken,
};
