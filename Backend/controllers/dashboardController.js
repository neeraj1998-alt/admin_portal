const dashboardService = require("../services/dashboardService");
const { successResponse } = require("../utils/apiResponse");

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    return res.status(200).json(successResponse(stats));
  } catch (error) {
    return next(error);
  }
};

const getRecentJobs = async (req, res, next) => {
  try {
    const recentJobs = await dashboardService.getRecentJobs(5);
    return res.status(200).json(successResponse(recentJobs));
  } catch (error) {
    return next(error);
  }
};

const getRecentApplications = async (req, res, next) => {
  try {
    const recentApplications = await dashboardService.getRecentApplications(5);
    return res.status(200).json(successResponse(recentApplications));
  } catch (error) {
    return next(error);
  }
};

const getApplicationStatus = async (req, res, next) => {
  try {
    const distribution = await dashboardService.getApplicationStatusDistribution();
    return res.status(200).json(successResponse(distribution));
  } catch (error) {
    return next(error);
  }
};

const getApplicationsByJob = async (req, res, next) => {
  try {
    const groupedApplications = await dashboardService.getApplicationsByJob();
    return res.status(200).json(successResponse(groupedApplications));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDashboardStats,
  getRecentJobs,
  getRecentApplications,
  getApplicationStatus,
  getApplicationsByJob,
};
