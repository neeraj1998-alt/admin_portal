const successResponse = (data = null) => ({
  success: true,
  data,
});

const errorResponse = (message = "Something went wrong", details = null) => {
  const response = {
    success: false,
    message,
  };

  if (details) {
    response.errors = details;
  }

  return response;
};

module.exports = {
  successResponse,
  errorResponse,
};
