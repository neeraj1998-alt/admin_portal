const { verifyToken } = require("../utils/jwt");
const { errorResponse } = require("../utils/apiResponse");

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(errorResponse("Authentication token is missing."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.admin = decoded;
    return next();
  } catch (error) {
    return res.status(401).json(errorResponse("Invalid or expired authentication token."));
  }
};

const authorizeAdmin = (allowedRoles = []) => {
  return (req, res, next) => {
    const adminRole = req.admin?.role;

    if (!adminRole || (allowedRoles.length > 0 && !allowedRoles.includes(adminRole))) {
      return res.status(403).json(errorResponse("You are not authorized to access this resource."));
    }

    return next();
  };
};

module.exports = {
  authenticateAdmin,
  authorizeAdmin,
};
