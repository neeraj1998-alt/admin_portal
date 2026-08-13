const candidateService = require("../services/candidate.service");

const getAllCandidates = async (req, res) => {
  try {
    const candidates = await candidateService.getAllCandidates();

    res.status(200).json({
      success: true,
      data: candidates
    });
  } catch (error) {
    if (!error.statusCode || error.statusCode === 500) {
      console.error("Error fetching candidates:", error);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch candidates"
    });
  }
};

const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await candidateService.getCandidateById(id);

    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    if (!error.statusCode || error.statusCode === 500) {
      console.error("Error fetching candidate:", error);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch candidate"
    });
  }
};

const createCandidate = async (req, res) => {
  try {
    const { first_name, last_name, email, phone } = req.body;

    const candidate = await candidateService.createCandidate({
      first_name,
      last_name,
      email,
      phone
    });

    res.status(201).json({
      success: true,
      message: "Candidate created successfully",
      data: candidate
    });
  } catch (error) {
    if (!error.statusCode || error.statusCode === 500) {
      console.error("Error creating candidate:", error);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create candidate"
    });
  }
};

const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCandidate = await candidateService.updateCandidate(id, req.body);

    res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      data: updatedCandidate
    });
  } catch (error) {
    if (!error.statusCode || error.statusCode === 500) {
      console.error("Error updating candidate:", error);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update candidate"
    });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    await candidateService.deleteCandidate(id);

    res.status(200).json({
      success: true,
      message: "Candidate deleted successfully"
    });
  } catch (error) {
    if (!error.statusCode || error.statusCode === 500) {
      console.error("Error deleting candidate:", error);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete candidate"
    });
  }
};

module.exports = {
  getAllCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate
};
