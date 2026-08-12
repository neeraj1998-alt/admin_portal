const pool = require("../config/database");

/**
 * Fetch all jobs with optional filtering, search, and pagination
 */
const findAllJobs = async ({ status, department, search, limit = 10, offset = 0 }) => {
    let query = `SELECT * FROM jobs WHERE 1=1`;
    const values = [];

    if (status) {
        values.push(status.toUpperCase());
        query += ` AND status = $${values.length}`;
    }

    if (department) {
        values.push(department);
        query += ` AND department ILIKE $${values.length}`;
    }

    if (search) {
        values.push(`%${search}%`);
        query += ` AND (title ILIKE $${values.length} OR description ILIKE $${values.length} OR skills ILIKE $${values.length})`;
    }

    // Count total query
    const countResult = await pool.query(query.replace("SELECT *", "SELECT COUNT(*)"), values);
    const total = parseInt(countResult.rows[0].count, 10);

    // Sorting & Pagination
    values.push(limit);
    query += ` ORDER BY created_at DESC LIMIT $${values.length}`;
    
    values.push(offset);
    query += ` OFFSET $${values.length}`;

    const result = await pool.query(query, values);
    return { jobs: result.rows, total };
};

/**
 * Fetch single job by ID
 */
const findJobById = async (id) => {
    const query = `SELECT * FROM jobs WHERE id = $1`;
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
        RETURNING *
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
