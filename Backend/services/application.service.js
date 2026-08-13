const applicationRepository = require("../repositories/application.repository");
const { isValidId, isValidApplicationStatus } = require("../utils/validators");

const getAllApplications = async (queryParams) => {
  let { search, jobId, status, startDate, endDate, page = 1, limit = 10 } = queryParams;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;

  const offset = (page - 1) * limit;

  if (jobId && !isValidId(jobId)) {
    const error = new Error("Invalid jobId filter");
    error.statusCode = 400;
    throw error;
  }

  if (status && !isValidApplicationStatus(status)) {
    const error = new Error("Invalid status filter");
    error.statusCode = 400;
    throw error;
  }

  const { applications, total } = await applicationRepository.getAllApplications({
    search,
    jobId: jobId ? Number(jobId) : null,
    status,
    startDate,
    endDate,
    limit,
    offset
  });

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    applications,
    pagination: {
      total,
      page,
      limit,
      totalPages
    }
  };
};

const getApplicationById = async (id) => {
  if (!isValidId(id)) {
    const error = new Error("Invalid application ID");
    error.statusCode = 400;
    throw error;
  }

  const application = await applicationRepository.getApplicationById(id);
  if (!application) {
    const error = new Error("Application not found");
    error.statusCode = 404;
    throw error;
  }

  return application;
};

const createApplication = async ({ candidate_id, job_id, status = "NEW" }) => {
  if (!isValidId(candidate_id)) {
    const error = new Error("Valid candidate_id is required");
    error.statusCode = 400;
    throw error;
  }

  if (!isValidId(job_id)) {
    const error = new Error("Valid job_id is required");
    error.statusCode = 400;
    throw error;
  }

  if (status && !isValidApplicationStatus(status)) {
    const error = new Error("Invalid application status");
    error.statusCode = 400;
    throw error;
  }

  const candidateExists = await applicationRepository.checkCandidateExists(candidate_id);
  if (!candidateExists) {
    const error = new Error("Candidate does not exist");
    error.statusCode = 404;
    throw error;
  }

  const jobExists = await applicationRepository.checkJobExists(job_id);
  if (!jobExists) {
    const error = new Error("Job does not exist");
    error.statusCode = 404;
    throw error;
  }

  const existingApp = await applicationRepository.findExistingApplication(candidate_id, job_id);
  if (existingApp) {
    const error = new Error("Candidate has already applied for this job");
    error.statusCode = 409;
    throw error;
  }

  return await applicationRepository.createApplication({
    candidate_id: Number(candidate_id),
    job_id: Number(job_id),
    status: status ? status.toUpperCase() : "NEW"
  });
};

const updateApplicationStatus = async (id, status) => {
  if (!isValidId(id)) {
    const error = new Error("Invalid application ID");
    error.statusCode = 400;
    throw error;
  }

  if (!status || !isValidApplicationStatus(status)) {
    const error = new Error("Valid application status is required (NEW, UNDER_REVIEW, SHORTLISTED, SELECTED, REJECTED)");
    error.statusCode = 400;
    throw error;
  }

  const application = await applicationRepository.getApplicationById(id);
  if (!application) {
    const error = new Error("Application not found");
    error.statusCode = 404;
    throw error;
  }

  return await applicationRepository.updateApplicationStatus(id, status);
};

module.exports = {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus
};
