CREATE TABLE documents (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    application_id BIGINT NOT NULL,

    document_type VARCHAR(50) NOT NULL,

    original_file_name VARCHAR(255) NOT NULL,

    stored_file_name VARCHAR(255),

    file_path VARCHAR(500) NOT NULL,

    mime_type VARCHAR(100),

    file_size BIGINT,

    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_documents_application
        FOREIGN KEY (application_id)
        REFERENCES applications(id)
);

CREATE INDEX idx_documents_application_id
ON documents(application_id);