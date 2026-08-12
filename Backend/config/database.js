const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const databaseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "admin_portal_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  ssl: process.env.DB_SSL === "true",
};

const isPostgresConfigured = Boolean(process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER);

module.exports = {
  databaseConfig,
  isPostgresConfigured,
};
