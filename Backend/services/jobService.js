const jobRepository = require("../repositories/jobRepository");

const getAllJobs = async (queryParams) => {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { jobs, total } = await jobRepository.findAllJobs({
        status: queryParams.status,
        department: queryParams.department,
        search: queryParams.search,
        limit,
        offset
    });

    return {
        jobs,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const getJobById = async (id) => {
    const job = await jobRepository.findJobById(id);
    if (!job) {
        const error = new Error(`Job with ID ${id} not found`);
        error.statusCode = 404;
        throw error;
    }
    return job;
};

const getJobStats = async () => {
    return await jobRepository.getJobStats();
};

const createJob = async (jobData) => {
    if (!jobData.title || !jobData.department || !jobData.location || !jobData.employment_type || !jobData.description) {
        const error = new Error("Title, department, location, employment_type, and description are required fields.");
        error.statusCode = 400;
        throw error;
    }

    if (jobData.status && !['DRAFT', 'ACTIVE', 'CLOSED'].includes(jobData.status.toUpperCase())) {
        const error = new Error("Invalid status. Allowed values are: DRAFT, ACTIVE, CLOSED.");
        error.statusCode = 400;
        throw error;
    }

    return await jobRepository.createJob(jobData);
};

const updateJob = async (id, jobData) => {
    await getJobById(id); // Ensures job exists

    if (jobData.status && !['DRAFT', 'ACTIVE', 'CLOSED'].includes(jobData.status.toUpperCase())) {
        const error = new Error("Invalid status. Allowed values are: DRAFT, ACTIVE, CLOSED.");
        error.statusCode = 400;
        throw error;
    }

    return await jobRepository.updateJob(id, jobData);
};

const changeJobStatus = async (id, status) => {
    await getJobById(id); // Ensures job exists

    const formattedStatus = status.toUpperCase();
    if (!['DRAFT', 'ACTIVE', 'CLOSED'].includes(formattedStatus)) {
        const error = new Error("Invalid status. Allowed values are: DRAFT, ACTIVE, CLOSED.");
        error.statusCode = 400;
        throw error;
    }

    return await jobRepository.updateJobStatus(id, formattedStatus);
};

const deleteJob = async (id) => {
    await getJobById(id); // Ensures job exists
    return await jobRepository.deleteJob(id);
};

module.exports = {
    getAllJobs,
    getJobById,
    getJobStats,
    createJob,
    updateJob,
    changeJobStatus,
    deleteJob
};
