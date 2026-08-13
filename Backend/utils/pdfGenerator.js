const fs = require("fs");
const path = require("path");

/**
 * Generates a clean, valid PDF (v1.4) buffer for a candidate resume
 */
function generatePdfBuffer({ name, position, email, phone, skills, experience }) {
  const sanitize = (str) => String(str || "").replace(/[()\\]/g, "");

  const safeName = sanitize(name || "Candidate Resume");
  const safePosition = sanitize(position || "Job Applicant");
  const safeEmail = sanitize(email || "candidate@example.com");
  const safePhone = sanitize(phone || "+91 98765 43210");
  const safeSkills = sanitize(skills || "Software Engineering, Problem Solving, Team Collaboration");
  const safeExp = sanitize(experience || "5+ Years of Industry Experience");

  const streamContent = `BT
/F1 22 Tf
50 740 Td
(${safeName}) Tj
/F1 14 Tf
0 -26 Td
(Applied Position: ${safePosition}) Tj
/F1 11 Tf
0 -22 Td
(Contact: ${safeEmail} | ${safePhone}) Tj
0 -30 Td
/F1 14 Tf
(PROFESSIONAL SUMMARY & QUALIFICATIONS) Tj
0 -20 Td
/F1 11 Tf
(Candidate possesses strong expertise in ${safePosition} responsibilities.) Tj
0 -16 Td
(Proven track record with ${safeExp}.) Tj
0 -26 Td
/F1 14 Tf
(KEY SKILLS & COMPETENCIES) Tj
0 -20 Td
/F1 11 Tf
(${safeSkills}) Tj
0 -26 Td
/F1 14 Tf
(ATTACHMENT NOTICE) Tj
0 -20 Td
/F1 11 Tf
(Official applicant CV uploaded to Database Recruitment Administration Portal.) Tj
ET`;

  const streamLength = Buffer.byteLength(streamContent, "utf-8");

  const pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000315 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${370 + streamLength}
%%EOF`;

  return Buffer.from(pdfString, "utf-8");
}

function ensurePdfFileExists(filePath, candidateData = {}) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    const parentDir = path.dirname(resolved);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    const pdfBuffer = generatePdfBuffer(candidateData);
    fs.writeFileSync(resolved, pdfBuffer);
  }
  return resolved;
}

module.exports = {
  generatePdfBuffer,
  ensurePdfFileExists,
};
