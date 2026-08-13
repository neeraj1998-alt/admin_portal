const documentService = require("../services/document.service");

const getDocumentsByApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const documents = await documentService.getDocumentsByApplicationId(applicationId);

    res.status(200).json({
      success: true,
      data: documents
    });
  } catch (error) {
    if (!error.statusCode || error.statusCode === 500) {
      console.error("Error fetching documents for application:", error);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch documents"
    });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { document_type } = req.body;

    const document = await documentService.createDocument(
      applicationId,
      req.file,
      document_type
    );

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document
    });
  } catch (error) {
    if (!error.statusCode || error.statusCode === 500) {
      console.error("Error uploading document:", error);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to upload document"
    });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await documentService.getDocumentById(id);

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    if (!error.statusCode || error.statusCode === 500) {
      console.error("Error fetching document:", error);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch document"
    });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const fileDetails = await documentService.getDocumentFileForDownload(id);

    res.download(fileDetails.filePath, fileDetails.originalFileName, (err) => {
      if (err && !res.headersSent) {
        console.error("Error sending file download:", err);
        res.status(500).json({
          success: false,
          message: "Failed to download document file"
        });
      }
    });
  } catch (error) {
    if (!error.statusCode || error.statusCode === 500) {
      console.error("Error downloading document:", error);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to download document"
    });
  }
};

module.exports = {
  getDocumentsByApplication,
  uploadDocument,
  getDocumentById,
  downloadDocument
};
