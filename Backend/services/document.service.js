const path = require("path");
const fs = require("fs");
const documentRepository = require("../repositories/document.repository");
const { isValidId } = require("../utils/validators");

const UPLOADS_DIR = path.resolve(__dirname, "../uploads/documents");

const getAllDocuments = async () => {
  return await documentRepository.getAllDocuments();
};

const getDocumentsByApplicationId = async (applicationId) => {
  if (!isValidId(applicationId)) {
    const error = new Error("Invalid application ID");
    error.statusCode = 400;
    throw error;
  }

  const appExists = await documentRepository.checkApplicationExists(applicationId);
  if (!appExists) {
    const error = new Error("Application not found");
    error.statusCode = 404;
    throw error;
  }

  return await documentRepository.getDocumentsByApplicationId(applicationId);
};

const createDocument = async (applicationId, file, document_type = "RESUME") => {
  if (!isValidId(applicationId)) {
    const error = new Error("Invalid application ID");
    error.statusCode = 400;
    throw error;
  }

  const appExists = await documentRepository.checkApplicationExists(applicationId);
  if (!appExists) {
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    const error = new Error("Application not found");
    error.statusCode = 404;
    throw error;
  }

  if (!file) {
    const error = new Error("No document file uploaded");
    error.statusCode = 400;
    throw error;
  }

  const cleanDocType = document_type && typeof document_type === "string" && document_type.trim()
    ? document_type.trim().toUpperCase()
    : "RESUME";

  const relativePath = `/uploads/documents/${file.filename}`;

  return await documentRepository.createDocument({
    application_id: Number(applicationId),
    document_type: cleanDocType,
    original_file_name: file.originalname,
    stored_file_name: file.filename,
    file_path: relativePath,
    mime_type: file.mimetype,
    file_size: file.size
  });
};

const getDocumentById = async (id) => {
  if (!isValidId(id)) {
    const error = new Error("Invalid document ID");
    error.statusCode = 400;
    throw error;
  }

  const document = await documentRepository.getDocumentById(id);
  if (!document) {
    const error = new Error("Document not found");
    error.statusCode = 404;
    throw error;
  }

  return document;
};

const getDocumentFileForDownload = async (id) => {
  if (!isValidId(id)) {
    const error = new Error("Invalid document ID");
    error.statusCode = 400;
    throw error;
  }

  const document = await documentRepository.getDocumentById(id);
  if (!document) {
    const error = new Error("Document not found");
    error.statusCode = 404;
    throw error;
  }

  let absolutePath;
  if (document.stored_file_name) {
    absolutePath = path.join(UPLOADS_DIR, path.basename(document.stored_file_name));
  } else {
    absolutePath = path.resolve(__dirname, "..", document.file_path.replace(/^\//, ""));
  }

  const resolvedPath = path.resolve(absolutePath);
  const projectRoot = path.resolve(__dirname, "..");
  if (!resolvedPath.startsWith(projectRoot)) {
    const error = new Error("Access denied: invalid file path");
    error.statusCode = 403;
    throw error;
  }

  if (!fs.existsSync(resolvedPath)) {
    const error = new Error("File not found on server");
    error.statusCode = 404;
    throw error;
  }

  return {
    filePath: resolvedPath,
    originalFileName: document.original_file_name,
    mimeType: document.mime_type
  };
};

module.exports = {
  getAllDocuments,
  getDocumentsByApplicationId,
  createDocument,
  getDocumentById,
  getDocumentFileForDownload
};
