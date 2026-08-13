CREATE TABLE applications (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    candidate_id BIGINT NOT NULL,

    job_id BIGINT NOT NULL,

    application_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    status VARCHAR(30) NOT NULL DEFAULT 'NEW',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT applications_status_check
        CHECK (
            status IN (
                'NEW',
                'UNDER_REVIEW',
                'SHORTLISTED',
                'SELECTED',
                'REJECTED'
            )
        ),

    CONSTRAINT fk_applications_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES candidates(id),

    CONSTRAINT fk_applications_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(id)
);

CREATE INDEX idx_applications_candidate_id
ON applications(candidate_id);

CREATE INDEX idx_applications_job_id
ON applications(job_id);

CREATE INDEX idx_applications_status
ON applications(status);