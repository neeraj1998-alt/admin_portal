const express = require("express");
const cors = require("cors");
const jobRoutes = require("./routes/jobRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Job Management Microservice is running."
    });
});

// B2 Job Routes
app.use("/api/jobs", jobRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || "Internal Server Error"
    });
});

module.exports = app;