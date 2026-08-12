CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    department VARCHAR(100) NOT NULL,

    location VARCHAR(150) NOT NULL,

    employment_type VARCHAR(50) NOT NULL,

    experience VARCHAR(100) NOT NULL,

    salary VARCHAR(100),

    description TEXT NOT NULL,

    requirements TEXT,

    skills TEXT,

    application_deadline DATE,

    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT jobs_status_check
        CHECK (status IN ('DRAFT', 'ACTIVE', 'CLOSED'))
);


CREATE INDEX idx_jobs_status
ON jobs(status);

CREATE INDEX idx_jobs_department
ON jobs(department);

CREATE INDEX idx_jobs_application_deadline
ON jobs(application_deadline);


CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS trigger_jobs_updated_at ON jobs;

CREATE TRIGGER trigger_jobs_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_jobs_updated_at();