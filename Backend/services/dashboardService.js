const dashboardRepository = require("../repositories/dashboardRepository");

const getDashboardStats = async () => {
  const jobs = await dashboardRepository.getJobs();
  const applications = await dashboardRepository.getApplications();

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((job) => job.status === "ACTIVE").length;
  const totalApplications = applications.length;
  const newApplications = applications.filter((application) => application.status === "NEW").length;
  const shortlistedCandidates = applications.filter((application) => application.status === "SHORTLISTED").length;
  const selectedCandidates = applications.filter((application) => application.status === "SELECTED").length;

  return {
    totalJobs,
    activeJobs,
    totalApplications,
    newApplications,
    shortlistedCandidates,
    selectedCandidates,
  };
};

const getRecentJobs = async (limit = 5) => {
  return dashboardRepository.getRecentJobs(limit);
};

const getRecentApplications = async (limit = 5) => {
  return dashboardRepository.getRecentApplications(limit);
};

const getApplicationStatusDistribution = async () => {
  return dashboardRepository.getApplicationStatusDistribution();
};

const getApplicationsByJob = async () => {
  return dashboardRepository.getApplicationsByJob();
};

module.exports = {
  getDashboardStats,
  getRecentJobs,
  getRecentApplications,
  getApplicationStatusDistribution,
  getApplicationsByJob,
};
