const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function seedAdminUsers() {
  try {
    const passwordHash = await bcrypt.hash('admin123', 10);
    const users = [
      {
        email: 'admin@mhtechin.com',
        role: 'ADMIN',
        account_status: 'ACTIVE',
        first_name: 'System',
        last_name: 'Admin',
      },
      {
        email: 'admin@company.com',
        role: 'ADMIN',
        account_status: 'ACTIVE',
        first_name: 'System',
        last_name: 'Administrator',
      },
      {
        email: 'recruiter1@company.com',
        role: 'RECRUITER',
        account_status: 'ACTIVE',
        first_name: 'Aisha',
        last_name: 'Patel',
      },
    ];

    for (const u of users) {
      await pool.query(
        `INSERT INTO admin_users (email, password_hash, role, account_status, first_name, last_name)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO UPDATE 
         SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, account_status = EXCLUDED.account_status`,
        [u.email, passwordHash, u.role, u.account_status, u.first_name, u.last_name]
      );
    }

    const res = await pool.query('SELECT id, email, role, account_status FROM admin_users');
    console.log('Successfully seeded admin_users table in PostgreSQL:');
    console.log(res.rows);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin users:', err);
    process.exit(1);
  }
}

seedAdminUsers();
