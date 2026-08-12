const { errorResponse } = require("../utils/apiResponse");
const { validateRequiredFields, validateField } = require("../utils/validation");

const validateRequest = (rules = {}, options = {}) => {
  const { source = "body", allowPartial = false } = options;

  return (req, res, next) => {
    const payload = req[source] || {};
    const errors = [];

    const requiredFields = rules.required || [];
    if (requiredFields.length > 0) {
      const requiredResult = validateRequiredFields(payload, requiredFields);
      errors.push(...requiredResult.errors);
    }

    const fieldRules = rules.fields || {};
    Object.entries(fieldRules).forEach(([field, fieldRule]) => {
      const value = payload[field];

      if (value === undefined && allowPartial) {
        return;
      }

      const validation = validateField({
        field,
        value,
        ...fieldRule,
      });

      if (validation) {
        errors.push(validation);
      }
    });

    if (errors.length > 0) {
      return res.status(400).json(errorResponse("Validation failed", errors));
    }

    return next();
  };
};

module.exports = {
  validateRequest,
};
