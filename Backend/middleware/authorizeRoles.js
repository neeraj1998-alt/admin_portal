const { errorResponse } = require("../utils/apiResponse");

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json(errorResponse("Authentication required."));
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json(errorResponse("You do not have permission to access this resource."));
    }

    return next();
  };
};

module.exports = {
  authorizeRoles,
};
