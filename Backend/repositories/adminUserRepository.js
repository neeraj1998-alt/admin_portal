const pool = require("../config/database");
const bcrypt = require("bcryptjs");

const defaultAdminPasswordHash = bcrypt.hashSync("admin123", 10);

const mockUsers = [
  {
    id: 1,
    email: "admin@company.com",
    password_hash: defaultAdminPasswordHash,
    role: "ADMIN",
    account_status: "ACTIVE",
    first_name: "System",
    last_name: "Administrator",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    email: "admin@mhtechin.com",
    password_hash: defaultAdminPasswordHash,
    role: "ADMIN",
    account_status: "ACTIVE",
    first_name: "Admin",
    last_name: "User",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    email: "recruiter1@company.com",
    password_hash: defaultAdminPasswordHash,
    role: "RECRUITER",
    account_status: "ACTIVE",
    first_name: "Aisha",
    last_name: "Patel",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    email: "recruiter2@company.com",
    password_hash: defaultAdminPasswordHash,
    role: "RECRUITER",
    account_status: "INACTIVE",
    first_name: "Rohan",
    last_name: "Sharma",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const findByEmail = async (email) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  try {
    const query = `
      SELECT id, email, password_hash, role, account_status, first_name, last_name, created_at, updated_at
      FROM admin_users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
    `;
    const result = await pool.query(query, [normalizedEmail]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (error) {
    console.warn("PostgreSQL admin_users lookup failed, checking fallback users:", error.message);
  }

  return mockUsers.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
};

const findById = async (id) => {
  const parsedId = Number(id);

  try {
    const query = `
      SELECT id, email, password_hash, role, account_status, first_name, last_name, created_at, updated_at
      FROM admin_users
      WHERE id = $1
    `;
    const result = await pool.query(query, [parsedId]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (error) {
    console.warn("PostgreSQL admin_users findById failed, checking fallback users:", error.message);
  }

  return mockUsers.find((user) => user.id === parsedId) || null;
};

const findAll = async () => {
  try {
    const query = `
      SELECT id, email, role, account_status, first_name, last_name, created_at, updated_at
      FROM admin_users
      ORDER BY id ASC
    `;
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      return result.rows;
    }
  } catch (error) {
    console.warn("PostgreSQL admin_users findAll failed, using fallback users:", error.message);
  }

  return mockUsers.map(({ password_hash, ...rest }) => rest);
};

const createAdminUser = async ({ email, password, role = "RECRUITER", first_name = "", last_name = "" }) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password || "admin123", 10);
  const normalizedRole = role.toUpperCase().includes("ADMIN") ? "ADMIN" : "RECRUITER";

  try {
    const query = `
      INSERT INTO admin_users (email, password_hash, role, account_status, first_name, last_name)
      VALUES ($1, $2, $3, 'ACTIVE', $4, $5)
      RETURNING id, email, role, account_status, first_name, last_name, created_at, updated_at
    `;
    const result = await pool.query(query, [normalizedEmail, passwordHash, normalizedRole, first_name, last_name]);
    return result.rows[0];
  } catch (error) {
    console.warn("PostgreSQL admin_users insert failed, saving to in-memory store:", error.message);
  }

  const newUser = {
    id: Date.now(),
    email: normalizedEmail,
    password_hash: passwordHash,
    role: normalizedRole,
    account_status: "ACTIVE",
    first_name,
    last_name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  return {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
    account_status: newUser.account_status,
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    created_at: newUser.created_at,
    updated_at: newUser.updated_at,
  };
};

const updateAdminUserStatus = async (id, status) => {
  const parsedId = Number(id);
  const normalizedStatus = String(status).toUpperCase() === "ACTIVE" ? "ACTIVE" : "INACTIVE";

  try {
    const query = `
      UPDATE admin_users
      SET account_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, role, account_status, first_name, last_name, created_at, updated_at
    `;
    const result = await pool.query(query, [normalizedStatus, parsedId]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (error) {
    console.warn("PostgreSQL admin_users status update failed, updating in-memory store:", error.message);
  }

  const user = mockUsers.find((u) => u.id === parsedId);
  if (user) {
    user.account_status = normalizedStatus;
    user.updated_at = new Date().toISOString();
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      account_status: user.account_status,
      first_name: user.first_name,
      last_name: user.last_name,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  return null;
};

const updatePassword = async (id, newPasswordHash) => {
  const parsedId = Number(id);

  try {
    const query = `
      UPDATE admin_users
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, role, account_status
    `;
    const result = await pool.query(query, [newPasswordHash, parsedId]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (error) {
    console.warn("PostgreSQL admin_users password update failed:", error.message);
  }

  const user = mockUsers.find((u) => u.id === parsedId);
  if (user) {
    user.password_hash = newPasswordHash;
    user.updated_at = new Date().toISOString();
    return user;
  }

  return null;
};

module.exports = {
  mockUsers,
  findByEmail,
  findById,
  findAll,
  createAdminUser,
  updateAdminUserStatus,
  updatePassword,
};
