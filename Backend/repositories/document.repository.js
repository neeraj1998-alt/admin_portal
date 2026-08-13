// const pool = require("../config/db");
const pool = require("../config/database");

const getDocumentsByApplicationId = async (applicationId) => {
  const query = `
    SELECT
      id,
      application_id,
      document_type,
      original_file_name,
      stored_file_name,
      file_path,
      mime_type,
      file_size,
      uploaded_at
    FROM documents
    WHERE application_id = $1
    ORDER BY id DESC
  `;

  const result = await pool.query(query, [applicationId]);
  return result.rows;
};

const createDocument = async ({
  application_id,
  document_type,
  original_file_name,
  stored_file_name,
  file_path,
  mime_type,
  file_size
}) => {
  const query = `
    INSERT INTO documents (
      application_id,
      document_type,
      original_file_name,
      stored_file_name,
      file_path,
      mime_type,
      file_size
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, application_id, document_type, original_file_name, stored_file_name, file_path, mime_type, file_size, uploaded_at
  `;

  const result = await pool.query(query, [
    application_id,
    document_type,
    original_file_name,
    stored_file_name || null,
    file_path,
    mime_type || null,
    file_size || null
  ]);

  return result.rows[0];
};

const getDocumentById = async (id) => {
  const query = `
    SELECT
      id,
      application_id,
      document_type,
      original_file_name,
      stored_file_name,
      file_path,
      mime_type,
      file_size,
      uploaded_at
    FROM documents
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const checkApplicationExists = async (applicationId) => {
  const query = `SELECT id FROM applications WHERE id = $1`;
  const result = await pool.query(query, [applicationId]);
  return result.rows.length > 0;
};

module.exports = {
  getDocumentsByApplicationId,
  createDocument,
  getDocumentById,
  checkApplicationExists
};
