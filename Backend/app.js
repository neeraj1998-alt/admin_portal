const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

require("dotenv").config();

const jobRoutes = require("./routes/jobRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/api", dashboardRoutes);

app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errorMiddleware);


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