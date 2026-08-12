const jobService = require("../services/jobService");

const getJobs = async (req, res, next) => {
    try {
        const result = await jobService.getAllJobs(req.query);
        res.status(200).json({
            success: true,
            data: result.jobs,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

const getJobStats = async (req, res, next) => {
    try {
        const stats = await jobService.getJobStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

const getJob = async (req, res, next) => {
    try {
        const job = await jobService.getJobById(req.params.id);
        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        next(error);
    }
};

const createJob = async (req, res, next) => {
    try {
        const newJob = await jobService.createJob(req.body);
        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: newJob
        });
    } catch (error) {
        next(error);
    }
};

const updateJob = async (req, res, next) => {
    try {
        const updatedJob = await jobService.updateJob(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: updatedJob
        });
    } catch (error) {
        next(error);
    }
};

const updateJobStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status field is required."
            });
        }
        const updatedJob = await jobService.changeJobStatus(req.params.id, status);
        res.status(200).json({
            success: true,
            message: `Job status updated to ${status.toUpperCase()}`,
            data: updatedJob
        });
    } catch (error) {
        next(error);
    }
};

const deleteJob = async (req, res, next) => {
    try {
        await jobService.deleteJob(req.params.id);
        res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getJobs,
    getJobStats,
    getJob,
    createJob,
    updateJob,
    updateJobStatus,
    deleteJob
};
