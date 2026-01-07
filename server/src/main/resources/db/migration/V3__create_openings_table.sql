-- Create the openings table for job opening management
CREATE TABLE openings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    type VARCHAR(50),
    positions INT NOT NULL DEFAULT 1,
    experience VARCHAR(100),
    min_salary VARCHAR(50),
    max_salary VARCHAR(50),
    skills TEXT,
    description TEXT,
    responsibilities TEXT,
    requirements TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_by BIGINT NOT NULL,
    updated_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_opening_status (status),
    INDEX idx_opening_department (department),
    INDEX idx_opening_created_at (created_at),
    INDEX idx_opening_created_by (created_by),
    
    -- Foreign key constraints
    CONSTRAINT fk_opening_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_opening_updated_by FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Add comment for documentation
ALTER TABLE openings COMMENT = 'Job openings posted by HR for recruitment';