const candidateRepository = require("../repositories/candidate.repository");
const { isValidEmail, isValidId } = require("../utils/validators");

const getAllCandidates = async () => {
  return await candidateRepository.getAllCandidates();
};

const getCandidateById = async (id) => {
  if (!isValidId(id)) {
    const error = new Error("Invalid candidate ID");
    error.statusCode = 400;
    throw error;
  }

  const candidate = await candidateRepository.getCandidateById(id);
  if (!candidate) {
    const error = new Error("Candidate not found");
    error.statusCode = 404;
    throw error;
  }

  return candidate;
};

const createCandidate = async ({ first_name, last_name, email, phone }) => {
  if (!first_name || typeof first_name !== "string" || !first_name.trim()) {
    const error = new Error("First name is required");
    error.statusCode = 400;
    throw error;
  }

  if (!email || !isValidEmail(email)) {
    const error = new Error("Valid email address is required");
    error.statusCode = 400;
    throw error;
  }

  const existingCandidate = await candidateRepository.getCandidateByEmail(email);
  if (existingCandidate) {
    const error = new Error("Candidate with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  return await candidateRepository.createCandidate({
    first_name: first_name.trim(),
    last_name: last_name && typeof last_name === "string" ? last_name.trim() : null,
    email: email.trim().toLowerCase(),
    phone: phone && typeof phone === "string" ? phone.trim() : null
  });
};

const updateCandidate = async (id, updateData) => {
  if (!isValidId(id)) {
    const error = new Error("Invalid candidate ID");
    error.statusCode = 400;
    throw error;
  }

  const existingCandidate = await candidateRepository.getCandidateById(id);
  if (!existingCandidate) {
    const error = new Error("Candidate not found");
    error.statusCode = 404;
    throw error;
  }

  const fields = {};

  if (updateData.first_name !== undefined) {
    if (typeof updateData.first_name !== "string" || !updateData.first_name.trim()) {
      const error = new Error("First name cannot be empty");
      error.statusCode = 400;
      throw error;
    }
    fields.first_name = updateData.first_name.trim();
  }

  if (updateData.last_name !== undefined) {
    fields.last_name = typeof updateData.last_name === "string" ? updateData.last_name.trim() : null;
  }

  if (updateData.email !== undefined) {
    if (!isValidEmail(updateData.email)) {
      const error = new Error("Valid email address is required");
      error.statusCode = 400;
      throw error;
    }
    const cleanEmail = updateData.email.trim().toLowerCase();
    if (cleanEmail !== existingCandidate.email.toLowerCase()) {
      const candidateWithEmail = await candidateRepository.getCandidateByEmail(cleanEmail);
      if (candidateWithEmail && candidateWithEmail.id !== existingCandidate.id) {
        const error = new Error("Candidate with this email already exists");
        error.statusCode = 409;
        throw error;
      }
    }
    fields.email = cleanEmail;
  }

  if (updateData.phone !== undefined) {
    fields.phone = typeof updateData.phone === "string" ? updateData.phone.trim() : null;
  }

  if (Object.keys(fields).length === 0) {
    const error = new Error("At least one valid field is required for update");
    error.statusCode = 400;
    throw error;
  }

  return await candidateRepository.updateCandidate(id, fields);
};

const deleteCandidate = async (id) => {
  if (!isValidId(id)) {
    const error = new Error("Invalid candidate ID");
    error.statusCode = 400;
    throw error;
  }

  const existingCandidate = await candidateRepository.getCandidateById(id);
  if (!existingCandidate) {
    const error = new Error("Candidate not found");
    error.statusCode = 404;
    throw error;
  }

  try {
    return await candidateRepository.deleteCandidate(id);
  } catch (err) {
    if (err.code === "23503") {
      const error = new Error("Cannot delete candidate with active applications");
      error.statusCode = 400;
      throw error;
    }
    throw err;
  }
};

module.exports = {
  getAllCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate
};
