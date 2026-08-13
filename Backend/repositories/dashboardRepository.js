const pool = require("../config/database");

const mockJobs = [
  {
    id: 1,
    title: "AWS Cloud Intern",
    department: "Cloud",
    location: "Pune",
    employment_type: "INTERNSHIP",
    experience: "Fresher",
    salary: "₹15,000/month",
    description: "Work with cloud infrastructure and assist in deploying and maintaining AWS services.",
    requirements: "Basic understanding of cloud computing and networking. Willingness to learn AWS services.",
    skills: "AWS, Linux, Networking, Git",
    application_deadline: "2026-09-30",
    status: "ACTIVE",
    created_at: "2026-08-01T10:00:00.000Z",
    updated_at: "2026-08-01T10:00:00.000Z",
  },
  {
    id: 2,
    title: "Embedded Developer Intern",
    department: "Engineering",
    location: "Pune",
    employment_type: "INTERNSHIP",
    experience: "Fresher",
    salary: "₹15,000/month",
    description: "Assist in developing and testing embedded software and hardware systems.",
    requirements: "Basic knowledge of C/C++ and embedded systems.",
    skills: "C, C++, Embedded Systems, Microcontrollers",
    application_deadline: "2026-09-25",
    status: "ACTIVE",
    created_at: "2026-08-03T11:15:00.000Z",
    updated_at: "2026-08-03T11:15:00.000Z",
  },
  {
    id: 3,
    title: "Field Executive",
    department: "Operations",
    location: "Pune",
    employment_type: "FULL_TIME",
    experience: "Fresher",
    salary: "₹3-4 LPA",
    description: "Handle field operations, coordinate with customers and maintain service records.",
    requirements: "Good communication skills and willingness to travel.",
    skills: "Communication, Operations, Customer Handling",
    application_deadline: "2026-09-20",
    status: "ACTIVE",
    created_at: "2026-08-05T12:00:00.000Z",
    updated_at: "2026-08-05T12:00:00.000Z",
  },
  {
    id: 4,
    title: "Software Engineer I",
    department: "Engineering",
    location: "Pune",
    employment_type: "FULL_TIME",
    experience: "0-2 Years",
    salary: "₹5-7 LPA",
    description: "Develop, test and maintain software applications as part of the engineering team.",
    requirements: "Bachelor degree in Computer Science or related field. Knowledge of programming fundamentals.",
    skills: "Java, SQL, Git, REST APIs",
    application_deadline: "2026-10-15",
    status: "ACTIVE",
    created_at: "2026-08-06T14:00:00.000Z",
    updated_at: "2026-08-06T14:00:00.000Z",
  },
  {
    id: 5,
    title: "Software Developer",
    department: "Engineering",
    location: "Pune",
    employment_type: "FULL_TIME",
    experience: "0-2 Years",
    salary: "₹5-8 LPA",
    description: "Design and develop scalable software applications and APIs.",
    requirements: "Strong programming fundamentals and understanding of databases.",
    skills: "Java, Python, SQL, Git",
    application_deadline: "2026-10-20",
    status: "DRAFT",
    created_at: "2026-08-07T08:30:00.000Z",
    updated_at: "2026-08-07T08:30:00.000Z",
  },
  {
    id: 6,
    title: "Embedded Software Developer",
    department: "Engineering",
    location: "Pune",
    employment_type: "FULL_TIME",
    experience: "1-3 Years",
    salary: "₹6-9 LPA",
    description: "Develop embedded software for electronic and industrial applications.",
    requirements: "Experience with C programming and embedded development.",
    skills: "C, Embedded C, RTOS, STM32",
    application_deadline: "2026-09-15",
    status: "CLOSED",
    created_at: "2026-08-08T09:10:00.000Z",
    updated_at: "2026-08-08T09:10:00.000Z",
  },
  {
    id: 7,
    title: "Business Development Executive",
    department: "Sales",
    location: "Mumbai",
    employment_type: "FULL_TIME",
    experience: "Fresher",
    salary: "₹3-5 LPA",
    description: "Identify business opportunities and build relationships with prospective customers.",
    requirements: "Good communication and negotiation skills.",
    skills: "Sales, Communication, Negotiation, CRM",
    application_deadline: "2026-11-01",
    status: "ACTIVE",
    created_at: "2026-08-09T15:15:00.000Z",
    updated_at: "2026-08-09T15:15:00.000Z",
  },
  {
    id: 8,
    title: "Backend Developer",
    department: "Engineering",
    location: "Remote",
    employment_type: "FULL_TIME",
    experience: "0-2 Years",
    salary: "₹6-10 LPA",
    description: "Build and maintain backend services and REST APIs for recruitment applications.",
    requirements: "Knowledge of backend development, databases and REST APIs.",
    skills: "Node.js, PostgreSQL, REST APIs, Git",
    application_deadline: "2026-10-30",
    status: "DRAFT",
    created_at: "2026-08-10T10:45:00.000Z",
    updated_at: "2026-08-10T10:45:00.000Z",
  },
];

const mockApplications = [
  { id: 1, job_id: 1, job_title: "AWS Cloud Intern", candidate_name: "Ananya Singh", status: "NEW", applied_at: "2026-08-12T09:30:00.000Z" },
  { id: 2, job_id: 1, job_title: "AWS Cloud Intern", candidate_name: "Rahul Verma", status: "SHORTLISTED", applied_at: "2026-08-11T14:10:00.000Z" },
  { id: 3, job_id: 2, job_title: "Embedded Developer Intern", candidate_name: "Nisha Reddy", status: "INTERVIEW", applied_at: "2026-08-10T11:00:00.000Z" },
  { id: 4, job_id: 3, job_title: "Field Executive", candidate_name: "Karan Mehta", status: "NEW", applied_at: "2026-08-12T08:50:00.000Z" },
  { id: 5, job_id: 4, job_title: "Software Engineer I", candidate_name: "Pooja Joshi", status: "SHORTLISTED", applied_at: "2026-08-09T13:25:00.000Z" },
  { id: 6, job_id: 4, job_title: "Software Engineer I", candidate_name: "Sarthak Patil", status: "SELECTED", applied_at: "2026-08-08T17:00:00.000Z" },
  { id: 7, job_id: 7, job_title: "Business Development Executive", candidate_name: "Shivani Kulkarni", status: "REJECTED", applied_at: "2026-08-07T10:20:00.000Z" },
  { id: 8, job_id: 7, job_title: "Business Development Executive", candidate_name: "Harsh Shah", status: "NEW", applied_at: "2026-08-12T16:40:00.000Z" },
  { id: 9, job_id: 2, job_title: "Embedded Developer Intern", candidate_name: "Vikram Pande", status: "SELECTED", applied_at: "2026-08-05T09:25:00.000Z" },
  { id: 10, job_id: 1, job_title: "AWS Cloud Intern", candidate_name: "Meera Iyer", status: "SHORTLISTED", applied_at: "2026-08-06T15:05:00.000Z" },
];

const getJobs = async () => {
  try {
    const result = await pool.query("SELECT * FROM jobs ORDER BY created_at DESC");
    if (result.rows.length > 0) {
      return result.rows;
    }
  } catch (error) {
    console.warn("PostgreSQL getJobs fallback:", error.message);
  }
  return [...mockJobs];
};

const getApplications = async () => {
  try {
    const query = `
      SELECT
        a.id,
        a.job_id,
        a.candidate_id,
        a.status,
        a.application_date AS applied_at,
        j.title AS job_title,
        CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS candidate_name
      FROM applications a
      JOIN candidates c ON a.candidate_id = c.id
      JOIN jobs j ON a.job_id = j.id
      ORDER BY a.application_date DESC
    `;
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      return result.rows;
    }
  } catch (error) {
    console.warn("PostgreSQL getApplications fallback:", error.message);
  }
  return [...mockApplications];
};

const getRecentJobs = async (limit = 5) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        j.*,
        COUNT(a.id)::int AS total_applications
      FROM jobs j
      LEFT JOIN applications a ON j.id = a.job_id
      GROUP BY j.id
      ORDER BY j.created_at DESC 
      LIMIT $1
      `,
      [limit]
    );
    if (result.rows.length > 0) {
      return result.rows;
    }
  } catch (error) {
    console.warn("PostgreSQL getRecentJobs fallback:", error.message);
  }

  return [...mockJobs]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
};

const getRecentApplications = async (limit = 5) => {
  try {
    const query = `
      SELECT
        a.id,
        a.job_id,
        a.candidate_id,
        a.status,
        a.application_date AS applied_at,
        j.title AS job_title,
        CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS candidate_name
      FROM applications a
      JOIN candidates c ON a.candidate_id = c.id
      JOIN jobs j ON a.job_id = j.id
      ORDER BY a.application_date DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    if (result.rows.length > 0) {
      return result.rows;
    }
  } catch (error) {
    console.warn("PostgreSQL getRecentApplications fallback:", error.message);
  }

  return [...mockApplications]
    .sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at))
    .slice(0, limit);
};

const getApplicationStatusDistribution = async () => {
  try {
    const query = `
      SELECT status, COUNT(*)::int AS count
      FROM applications
      GROUP BY status
    `;
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      return result.rows;
    }
  } catch (error) {
    console.warn("PostgreSQL getApplicationStatusDistribution fallback:", error.message);
  }

  return Object.entries(
    mockApplications.reduce((acc, application) => {
      const status = application.status || "UNKNOWN";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ status, count }));
};

const getApplicationsByJob = async () => {
  try {
    const query = `
      SELECT
        j.id AS job_id,
        j.title AS job_title,
        COUNT(a.id)::int AS count
      FROM jobs j
      LEFT JOIN applications a ON j.id = a.job_id
      GROUP BY j.id, j.title
      ORDER BY count DESC
    `;
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      return result.rows;
    }
  } catch (error) {
    console.warn("PostgreSQL getApplicationsByJob fallback:", error.message);
  }

  const grouped = mockApplications.reduce((acc, application) => {
    const key = application.job_id;

    if (!acc[key]) {
      acc[key] = {
        job_id: application.job_id,
        job_title: application.job_title,
        count: 0,
      };
    }

    acc[key].count += 1;
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => b.count - a.count);
};

module.exports = {
  mockJobs,
  mockApplications,
  getJobs,
  getApplications,
  getRecentJobs,
  getRecentApplications,
  getApplicationStatusDistribution,
  getApplicationsByJob,
};
