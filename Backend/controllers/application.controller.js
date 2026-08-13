const applicationService = require("../services/application.service");

const getAllApplications = async (req, res) => {
  try {
    const result = await applicationService.getAllApplications(req.query);

    res.status(200).json({
      success: true,
      data: result.applications,
      pagination: result.pagination
    });
  } catch (error) {
    if (!error.statusCode || error.statusCode === 500) {
      console.error("Error fetching applications:", error);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch applications"
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await applicationService.getApplicationById(id);

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    if (!error.statusCode || error.statusCode === 500) {
      console.error("Error fetching application:", error);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch application"
    });
  }
};

const createApplication = async (req, res) => {
  try {
    const { candidate_id, job_id, status } = req.body;

    const application = await applicationService.createApplication({
      candidate_id,
      job_id,
      status
    });

    res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: application
    });
  } catch (error) {
    if (!error.statusCode || error.statusCode === 500) {
      console.error("Error creating application:", error);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create application"
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedApplication = await applicationService.updateApplicationStatus(id, status);

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: updatedApplication
    });
  } catch (error) {
    if (!error.statusCode || error.statusCode === 500) {
      console.error("Error updating application status:", error);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update application status"
    });
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus
};
