const pool = require('../config/database');

async function cleanupAndReseed() {
  try {
    console.log('Connecting to PostgreSQL database...');

    // 1. Fetch all existing jobs
    const jobsRes = await pool.query('SELECT id, title, department, created_at FROM jobs ORDER BY id ASC');
    console.log(`Found ${jobsRes.rows.length} total jobs in database.`);
    jobsRes.rows.forEach(j => {
      console.log(`  Job ID: ${j.id} | Title: "${j.title}" | Dept: ${j.department} | Created: ${j.created_at}`);
    });

    // 2. Fetch all existing applications
    const appsRes = await pool.query('SELECT id, candidate_id, job_id, status FROM applications ORDER BY id ASC');
    console.log(`\nFound ${appsRes.rows.length} total applications in database.`);
    appsRes.rows.forEach(a => {
      console.log(`  App ID: ${a.id} | Candidate ID: ${a.candidate_id} | Job ID: ${a.job_id} | Status: ${a.status}`);
    });

    // 3. Identify duplicate jobs by title
    const titleMap = new Map(); // title -> primary job object
    const duplicateIds = [];

    jobsRes.rows.forEach(job => {
      const normalizedTitle = job.title.trim().toLowerCase();
      if (!titleMap.has(normalizedTitle)) {
        titleMap.set(normalizedTitle, job);
      } else {
        duplicateIds.push({
          dupId: job.id,
          primaryId: titleMap.get(normalizedTitle).id,
          title: job.title
        });
      }
    });

    console.log(`\nIdentified ${duplicateIds.length} duplicate job records.`);
    duplicateIds.forEach(d => {
      console.log(`  Duplicate Job ID ${d.dupId} ("${d.title}") -> Map to Primary Job ID ${d.primaryId}`);
    });

    // 4. Update applications pointing to duplicate job IDs to point to primary job IDs
    for (const d of duplicateIds) {
      const updateRes = await pool.query(
        'UPDATE applications SET job_id = $1 WHERE job_id = $2 RETURNING id',
        [d.primaryId, d.dupId]
      );
      if (updateRes.rows.length > 0) {
        console.log(`  Re-linked ${updateRes.rows.length} application(s) from Job ID ${d.dupId} to Primary Job ID ${d.primaryId}`);
      }
    }

    // 5. Delete duplicate jobs
    if (duplicateIds.length > 0) {
      const idsToDelete = duplicateIds.map(d => d.dupId);
      await pool.query('DELETE FROM jobs WHERE id = ANY($1::int[])', [idsToDelete]);
      console.log(`\nSuccessfully deleted ${idsToDelete.length} duplicate jobs.`);
    }

    // 6. Verify final jobs and application counts
    const finalJobsRes = await pool.query(`
      SELECT 
        j.id, 
        j.title, 
        j.department, 
        COUNT(a.id)::int AS total_applications
      FROM jobs j
      LEFT JOIN applications a ON j.id = a.job_id
      GROUP BY j.id
      ORDER BY j.id ASC
    `);

    console.log('\n========================================');
    console.log('FINAL CLEANED JOBS TABLE (WITH APP COUNTS):');
    console.log('========================================');
    finalJobsRes.rows.forEach(j => {
      console.log(`  Job ID ${j.id}: "${j.title}" -> ${j.total_applications} application(s)`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
}

cleanupAndReseed();
