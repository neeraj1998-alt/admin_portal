const validateRequiredFields = (data = {}, requiredFields = []) => {
  const errors = [];

  requiredFields.forEach((field) => {
    const value = data[field];

    if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
      errors.push({
        field,
        message: `${field} is required.`,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const isValidEmail = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

const validateField = ({
  field,
  value,
  required = false,
  type = null,
  minLength = null,
  maxLength = null,
  customValidator = null,
}) => {
  if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
    if (required) {
      return {
        field,
        message: `${field} is required.`,
      };
    }

    return null;
  }

  if (type === "email" && !isValidEmail(value)) {
    return {
      field,
      message: `${field} must be a valid email address.`,
    };
  }

  if (type === "string" && typeof value !== "string") {
    return {
      field,
      message: `${field} must be a string.`,
    };
  }

  if (type === "number" && (Number.isNaN(Number(value)) || value === "")) {
    return {
      field,
      message: `${field} must be a valid number.`,
    };
  }

  if (typeof value === "string") {
    if (minLength !== null && value.trim().length < minLength) {
      return {
        field,
        message: `${field} must be at least ${minLength} characters long.`,
      };
    }

    if (maxLength !== null && value.trim().length > maxLength) {
      return {
        field,
        message: `${field} must be no longer than ${maxLength} characters.`,
      };
    }
  }

  if (typeof customValidator === "function") {
    const validationMessage = customValidator(value);

    if (validationMessage) {
      return {
        field,
        message: validationMessage,
      };
    }
  }

  return null;
};

module.exports = {
  validateRequiredFields,
  isValidEmail,
  validateField,
};
