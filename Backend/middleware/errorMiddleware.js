const { errorResponse } = require("../utils/apiResponse");

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development" && err.stack) {
    return res.status(statusCode).json(
      errorResponse(message, { stack: err.stack })
    );
  }

  return res.status(statusCode).json(errorResponse(message));
};

module.exports = errorMiddleware;
