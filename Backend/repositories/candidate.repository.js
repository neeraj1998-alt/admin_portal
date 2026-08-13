// const pool = require("../config/db");
const pool = require("../config/database");

const getAllCandidates = async () => {
  const query = `
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      created_at,
      updated_at
    FROM candidates
    ORDER BY id DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const getCandidateById = async (id) => {
  const query = `
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      created_at,
      updated_at
    FROM candidates
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const getCandidateByEmail = async (email) => {
  const query = `
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      created_at,
      updated_at
    FROM candidates
    WHERE LOWER(email) = LOWER($1)
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const createCandidate = async ({ first_name, last_name, email, phone }) => {
  const query = `
    INSERT INTO candidates (first_name, last_name, email, phone)
    VALUES ($1, $2, $3, $4)
    RETURNING id, first_name, last_name, email, phone, created_at, updated_at
  `;

  const result = await pool.query(query, [
    first_name,
    last_name || null,
    email,
    phone || null
  ]);

  return result.rows[0];
};

const updateCandidate = async (id, fields) => {
  const setClauses = [];
  const queryParams = [];
  let paramIdx = 1;

  if (fields.first_name !== undefined) {
    setClauses.push(`first_name = $${paramIdx++}`);
    queryParams.push(fields.first_name);
  }
  if (fields.last_name !== undefined) {
    setClauses.push(`last_name = $${paramIdx++}`);
    queryParams.push(fields.last_name || null);
  }
  if (fields.email !== undefined) {
    setClauses.push(`email = $${paramIdx++}`);
    queryParams.push(fields.email);
  }
  if (fields.phone !== undefined) {
    setClauses.push(`phone = $${paramIdx++}`);
    queryParams.push(fields.phone || null);
  }

  setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

  queryParams.push(id);
  const query = `
    UPDATE candidates
    SET ${setClauses.join(", ")}
    WHERE id = $${paramIdx}
    RETURNING id, first_name, last_name, email, phone, created_at, updated_at
  `;

  const result = await pool.query(query, queryParams);
  return result.rows[0];
};

const deleteCandidate = async (id) => {
  const query = `
    DELETE FROM candidates
    WHERE id = $1
    RETURNING id
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  getAllCandidates,
  getCandidateById,
  getCandidateByEmail,
  createCandidate,
  updateCandidate,
  deleteCandidate
};
