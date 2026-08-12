INSERT INTO admin_users (
    email,
    password_hash,
    role,
    account_status,
    first_name,
    last_name
)
VALUES
(
    'admin@company.com',
    '$2a$12$7x8Wq6Q7xE0pP8r0b8Qh4u8u7sU5k4fS8mQ2JbO4KHZpUQXxRj1mO',
    'ADMIN',
    'ACTIVE',
    'System',
    'Administrator'
),

(
    'recruiter1@company.com',
    '$2a$12$W8y7Gd3I7C7sH3r5R2x7ceL0M9nQmX8JB9cA1q8pVtvy0w0I1jlbW',
    'RECRUITER',
    'ACTIVE',
    'Aisha',
    'Patel'
),

(
    'recruiter2@company.com',
    '$2a$12$wN3xY9yBdM6D5lF6F2n0yO7l6xYk4FJ6T.kcYz8eQ7R1vU2vXkKu',
    'RECRUITER',
    'INACTIVE',
    'Rohan',
    'Sharma'
);
