-- Create the candidate_openings table to track applications
CREATE TABLE candidate_openings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    opening_id BIGINT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    application_status VARCHAR(20) DEFAULT 'APPLIED',
    notes TEXT,
    applied_by BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Unique constraint to prevent duplicate applications
    UNIQUE KEY uk_candidate_opening (candidate_id, opening_id),
    
    -- Indexes for performance
    INDEX idx_candidate_opening_candidate (candidate_id),
    INDEX idx_candidate_opening_opening (opening_id),
    INDEX idx_candidate_opening_applied_at (applied_at),
    INDEX idx_candidate_opening_status (application_status),
    
    -- Foreign key constraints
    CONSTRAINT fk_candidate_opening_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    CONSTRAINT fk_candidate_opening_opening FOREIGN KEY (opening_id) REFERENCES openings(id) ON DELETE CASCADE,
    CONSTRAINT fk_candidate_opening_applied_by FOREIGN KEY (applied_by) REFERENCES users(id)
);

-- Add comment for documentation
ALTER TABLE candidate_openings COMMENT = 'Tracks which candidates have applied to which job openings';