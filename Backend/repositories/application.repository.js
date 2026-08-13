// const pool = require("../config/db");
const pool = require("../config/database");

const getAllApplications = async ({ search, jobId, status, startDate, endDate, limit = 10, offset = 0 }) => {
  let whereClauses = [];
  let queryParams = [];
  let paramIdx = 1;

  if (search && search.trim() !== "") {
    const searchPattern = `%${search.trim()}%`;
    whereClauses.push(
      `(c.first_name ILIKE $${paramIdx} OR c.last_name ILIKE $${paramIdx} OR c.email ILIKE $${paramIdx} OR j.title ILIKE $${paramIdx})`
    );
    queryParams.push(searchPattern);
    paramIdx++;
  }

  if (jobId) {
    whereClauses.push(`a.job_id = $${paramIdx++}`);
    queryParams.push(jobId);
  }

  if (status) {
    whereClauses.push(`a.status = $${paramIdx++}`);
    queryParams.push(status.toUpperCase());
  }

  if (startDate) {
    whereClauses.push(`a.application_date >= $${paramIdx++}`);
    queryParams.push(startDate);
  }

  if (endDate) {
    whereClauses.push(`a.application_date <= $${paramIdx++}`);
    queryParams.push(endDate);
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM applications a
    JOIN candidates c ON a.candidate_id = c.id
    JOIN jobs j ON a.job_id = j.id
    ${whereString}
  `;
  const countResult = await pool.query(countQuery, queryParams);
  const total = parseInt(countResult.rows[0].total, 10);

  const dataQuery = `
    SELECT
      a.id,
      a.candidate_id,
      a.job_id,
      a.application_date,
      a.status,
      a.created_at,
      a.updated_at,
      c.first_name AS candidate_first_name,
      c.last_name AS candidate_last_name,
      c.email AS candidate_email,
      c.phone AS candidate_phone,
      j.title AS job_title,
      j.department AS job_department,
      j.location AS job_location,
      j.employment_type AS job_employment_type,
      j.status AS job_status
    FROM applications a
    JOIN candidates c ON a.candidate_id = c.id
    JOIN jobs j ON a.job_id = j.id
    ${whereString}
    ORDER BY a.id DESC
    LIMIT $${paramIdx++} OFFSET $${paramIdx++}
  `;

  queryParams.push(limit, offset);
  const result = await pool.query(dataQuery, queryParams);

  const formattedRows = result.rows.map((row) => ({
    id: row.id,
    candidate_id: row.candidate_id,
    job_id: row.job_id,
    application_date: row.application_date,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    candidate: {
      id: row.candidate_id,
      first_name: row.candidate_first_name,
      last_name: row.candidate_last_name,
      email: row.candidate_email,
      phone: row.candidate_phone
    },
    job: {
      id: row.job_id,
      title: row.job_title,
      department: row.job_department,
      location: row.job_location,
      employment_type: row.job_employment_type,
      status: row.job_status
    }
  }));

  return {
    applications: formattedRows,
    total
  };
};

const getApplicationById = async (id) => {
  const query = `
    SELECT
      a.id,
      a.candidate_id,
      a.job_id,
      a.application_date,
      a.status,
      a.created_at,
      a.updated_at,
      c.first_name AS candidate_first_name,
      c.last_name AS candidate_last_name,
      c.email AS candidate_email,
      c.phone AS candidate_phone,
      j.title AS job_title,
      j.department AS job_department,
      j.location AS job_location,
      j.employment_type AS job_employment_type,
      j.experience AS job_experience,
      j.salary AS job_salary,
      j.status AS job_status
    FROM applications a
    JOIN candidates c ON a.candidate_id = c.id
    JOIN jobs j ON a.job_id = j.id
    WHERE a.id = $1
  `;

  const result = await pool.query(query, [id]);
  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id,
    candidate_id: row.candidate_id,
    job_id: row.job_id,
    application_date: row.application_date,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    candidate: {
      id: row.candidate_id,
      first_name: row.candidate_first_name,
      last_name: row.candidate_last_name,
      email: row.candidate_email,
      phone: row.candidate_phone
    },
    job: {
      id: row.job_id,
      title: row.job_title,
      department: row.job_department,
      location: row.job_location,
      employment_type: row.job_employment_type,
      experience: row.job_experience,
      salary: row.job_salary,
      status: row.job_status
    }
  };
};

const createApplication = async ({ candidate_id, job_id, status = "NEW" }) => {
  const query = `
    INSERT INTO applications (candidate_id, job_id, status)
    VALUES ($1, $2, $3)
    RETURNING id, candidate_id, job_id, application_date, status, created_at, updated_at
  `;

  const result = await pool.query(query, [candidate_id, job_id, status.toUpperCase()]);
  return result.rows[0];
};

const updateApplicationStatus = async (id, status) => {
  const query = `
    UPDATE applications
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, candidate_id, job_id, application_date, status, created_at, updated_at
  `;

  const result = await pool.query(query, [status.toUpperCase(), id]);
  return result.rows[0];
};

const checkCandidateExists = async (candidate_id) => {
  const query = `SELECT id FROM candidates WHERE id = $1`;
  const result = await pool.query(query, [candidate_id]);
  return result.rows.length > 0;
};

const checkJobExists = async (job_id) => {
  const query = `SELECT id FROM jobs WHERE id = $1`;
  const result = await pool.query(query, [job_id]);
  return result.rows.length > 0;
};

const findExistingApplication = async (candidate_id, job_id) => {
  const query = `SELECT id FROM applications WHERE candidate_id = $1 AND job_id = $2`;
  const result = await pool.query(query, [candidate_id, job_id]);
  return result.rows[0];
};

module.exports = {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  checkCandidateExists,
  checkJobExists,
  findExistingApplication
};
