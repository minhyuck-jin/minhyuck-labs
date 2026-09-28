CREATE TABLE labs_schema_version (
    version_number INT PRIMARY KEY,
    applied_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
