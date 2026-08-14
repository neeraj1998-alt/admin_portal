const pool = require("../config/database");
const { ensurePdfFileExists } = require("../utils/pdfGenerator");
const path = require("path");

const candidatesData = [
  { appId: 1, name: 'Rahul Sharma', pos: 'Senior React Frontend Developer', file: 'Rahul_Sharma_Resume.pdf', stored: 'resume_1.pdf' },
  { appId: 2, name: 'Priya Patil', pos: 'Lead DevOps & Cloud Engineer', file: 'Priya_Patil_Resume.pdf', stored: 'resume_2.pdf' },
  { appId: 3, name: 'Amit Verma', pos: 'Staff Backend Engineer', file: 'Amit_Verma_Resume.pdf', stored: 'resume_3.pdf' },
  { appId: 4, name: 'Sneha Kulkarni', pos: 'Full Stack Node.js Engineer', file: 'Sneha_Kulkarni_Resume.pdf', stored: 'resume_4.pdf' },
  { appId: 5, name: 'Neha Deshmukh', pos: 'Senior QA Automation Engineer', file: 'Neha_Deshmukh_Resume.pdf', stored: 'resume_5.pdf' },
  { appId: 12, name: 'Shreya Salve', pos: 'Software Engineer I', file: 'Shreya_Salve_Resume.pdf', stored: 'resume_20.pdf' },
];

async function seed() {
  try {
    for (const c of candidatesData) {
      const docPath1 = path.join(__dirname, "../uploads/documents", c.stored);
      const docPath2 = path.join(__dirname, "../uploads/resumes", c.stored);

      ensurePdfFileExists(docPath1, { name: c.name, position: c.pos });
      ensurePdfFileExists(docPath2, { name: c.name, position: c.pos });

      const checkRes = await pool.query("SELECT id FROM documents WHERE application_id = $1", [c.appId]);
      if (checkRes.rows.length === 0) {
        await pool.query(
          `INSERT INTO documents (application_id, document_type, original_file_name, stored_file_name, file_path, mime_type, file_size)
           VALUES ($1, 'RESUME', $2, $3, $4, 'application/pdf', 245760)`,
          [c.appId, c.file, c.stored, `/uploads/resumes/${c.stored}`]
        );
        console.log(`Inserted DB document for application ${c.appId} (${c.name})`);
      } else {
        console.log(`Document already exists in DB for application ${c.appId}`);
      }
    }
    console.log("All candidate resume PDF files and DB records initialized.");
  } catch (e) {
    console.error("Error seeding documents:", e.message);
  } finally {
    pool.end();
  }
}

seed();
