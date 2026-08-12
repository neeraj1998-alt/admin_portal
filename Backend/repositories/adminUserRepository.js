const mockUsers = [
  {
    id: 1,
    email: "admin@company.com",
    password_hash: "$2b$12$WfjvZ8b1/Cn5ePCw6zN38uZaiJq4jMlPBZgXZE0kDXW76dHHb.O6.",
    role: "ADMIN",
    account_status: "ACTIVE",
    first_name: "System",
    last_name: "Administrator",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    email: "recruiter1@company.com",
    password_hash: "$2b$12$ZvgTF/w0YJshV8E.LPoLEOsYVKhgoF8BHIUv1fKoH4jsbuFP1tOeW",
    role: "RECRUITER",
    account_status: "ACTIVE",
    first_name: "Aisha",
    last_name: "Patel",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    email: "recruiter2@company.com",
    password_hash: "$2b$12$ZvgTF/w0YJshV8E.LPoLEOsYVKhgoF8BHIUv1fKoH4jsbuFP1tOeW",
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

  return mockUsers.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
};

const findById = async (id) => {
  const parsedId = Number(id);
  return mockUsers.find((user) => user.id === parsedId) || null;
};

module.exports = {
  mockUsers,
  findByEmail,
  findById,
};
