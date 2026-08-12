const bcrypt = require("bcryptjs");
const adminUserRepository = require("../repositories/adminUserRepository");
const { generateToken } = require("../utils/jwt");

const login = async ({ email, password }) => {
  if (!email) {
    const error = new Error("Email is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!password) {
    const error = new Error("Password is required.");
    error.statusCode = 400;
    throw error;
  }

  const user = await adminUserRepository.findByEmail(email);

  if (!user) {
    const error = new Error("Invalid credentials.");
    error.statusCode = 401;
    throw error;
  }

  if (user.account_status !== "ACTIVE") {
    const error = new Error("Account is inactive.");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    const error = new Error("Invalid credentials.");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    account_status: user.account_status,
    first_name: user.first_name,
    last_name: user.last_name,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      account_status: user.account_status,
      first_name: user.first_name,
      last_name: user.last_name,
    },
  };
};

module.exports = {
  login,
};
