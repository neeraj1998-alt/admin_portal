const { errorResponse } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode >= 500 ? "Internal Server Error" : err.message || "Something went wrong";

  const payload = errorResponse(message);

  if (process.env.NODE_ENV === "development" && err.stack) {
    payload.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  errorHandler,
};
