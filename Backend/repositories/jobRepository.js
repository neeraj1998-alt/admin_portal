const pool = require("../config/database");

/**
 * Fetch all jobs with optional filtering, search, pagination, and total applications count
 */
const findAllJobs = async ({ status, department, search, limit = 10, offset = 0 }) => {
    let whereClauses = [];
    const values = [];

    if (status) {
        values.push(status.toUpperCase());
        whereClauses.push(`j.status = $${values.length}`);
    }

    if (department) {
        values.push(department);
        whereClauses.push(`j.department ILIKE $${values.length}`);
    }

    if (search) {
        values.push(`%${search}%`);
        whereClauses.push(`(j.title ILIKE $${values.length} OR j.description ILIKE $${values.length} OR j.skills ILIKE $${values.length})`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // Count total jobs matching filters
    const countQuery = `SELECT COUNT(*) FROM jobs j ${whereSql}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count, 10);

    // Fetch jobs with LEFT JOIN to get total applications count
    values.push(limit);
    const limitParam = `$${values.length}`;
    values.push(offset);
    const offsetParam = `$${values.length}`;

    const query = `
        SELECT 
            j.*,
            COUNT(a.id)::int AS total_applications
        FROM jobs j
        LEFT JOIN applications a ON j.id = a.job_id
        ${whereSql}
        GROUP BY j.id
        ORDER BY j.created_at DESC
        LIMIT ${limitParam} OFFSET ${offsetParam}
    `;

    const result = await pool.query(query, values);
    return { jobs: result.rows, total };
};

/**
 * Fetch single job by ID with application count
 */
const findJobById = async (id) => {
    const query = `
        SELECT 
            j.*,
            COUNT(a.id)::int AS total_applications
        FROM jobs j
        LEFT JOIN applications a ON j.id = a.job_id
        WHERE j.id = $1
        GROUP BY j.id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};

/**
 * Get job statistics breakdown for dashboard / summary counters
 */
const getJobStats = async () => {
    const query = `
        SELECT 
            COUNT(*) AS total_jobs,
            COUNT(*) FILTER (WHERE status = 'ACTIVE') AS active_jobs,
            COUNT(*) FILTER (WHERE status = 'DRAFT') AS draft_jobs,
            COUNT(*) FILTER (WHERE status = 'CLOSED') AS closed_jobs
        FROM jobs
    `;
    const result = await pool.query(query);
    const row = result.rows[0];
    return {
        totalJobs: parseInt(row.total_jobs, 10),
        activeJobs: parseInt(row.active_jobs, 10),
        draftJobs: parseInt(row.draft_jobs, 10),
        closedJobs: parseInt(row.closed_jobs, 10)
    };
};

/**
 * Create a new job
 */
const createJob = async (jobData) => {
    const {
        title,
        department,
        location,
        employment_type,
        experience,
        salary,
        description,
        requirements,
        skills,
        application_deadline,
        status = 'DRAFT'
    } = jobData;

    const query = `
        INSERT INTO jobs (
            title, department, location, employment_type, experience, 
            salary, description, requirements, skills, application_deadline, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *, 0 AS total_applications
    `;

    const values = [
        title, department, location, employment_type, experience,
        salary, description, requirements, skills, application_deadline, status.toUpperCase()
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};

/**
 * Update job details by ID
 */
const updateJob = async (id, jobData) => {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const fillable = [
        'title', 'department', 'location', 'employment_type', 'experience',
        'salary', 'description', 'requirements', 'skills', 'application_deadline', 'status'
    ];

    fillable.forEach((key) => {
        if (jobData[key] !== undefined) {
            fields.push(`${key} = $${paramIndex}`);
            values.push(key === 'status' ? jobData[key].toUpperCase() : jobData[key]);
            paramIndex++;
        }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
        UPDATE jobs 
        SET ${fields.join(', ')} 
        WHERE id = $${paramIndex} 
        RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
};

/**
 * Update job status (DRAFT, ACTIVE, CLOSED)
 */
const updateJobStatus = async (id, status) => {
    const query = `
        UPDATE jobs 
        SET status = $1 
        WHERE id = $2 
        RETURNING *
    `;
    const result = await pool.query(query, [status.toUpperCase(), id]);
    return result.rows[0] || null;
};

/**
 * Delete a job by ID
 */
const deleteJob = async (id) => {
    const query = `DELETE FROM jobs WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};

module.exports = {
    findAllJobs,
    findJobById,
    getJobStats,
    createJob,
    updateJob,
    updateJobStatus,
    deleteJob
};
