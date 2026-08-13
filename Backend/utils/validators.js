const isValidEmail = (email) => {
  if (typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const isValidId = (id) => {
  if (id === undefined || id === null) return false;
  const num = Number(id);
  return Number.isInteger(num) && num > 0;
};

const VALID_APPLICATION_STATUSES = [
  "NEW",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "SELECTED",
  "REJECTED"
];

const isValidApplicationStatus = (status) => {
  return typeof status === "string" && VALID_APPLICATION_STATUSES.includes(status.toUpperCase());
};

module.exports = {
  isValidEmail,
  isValidId,
  isValidApplicationStatus,
  VALID_APPLICATION_STATUSES
};
