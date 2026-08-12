const { verifyToken } = require("../utils/jwt");
const { errorResponse } = require("../utils/apiResponse");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(errorResponse("Authentication token is missing."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json(errorResponse("Invalid or expired authentication token."));
  }
};

module.exports = authMiddleware;
