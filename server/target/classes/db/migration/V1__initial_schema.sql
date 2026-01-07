-- =====================================================
-- Consultancy Management System - Initial Schema
-- Optimized for millions of records
-- Database: MySQL 8.0+
-- =====================================================

-- =====================================================
-- 1. ACCOUNT TABLE (Admin + HR)
-- =====================================================
CREATE TABLE account (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    role ENUM('ADMIN', 'HR') NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    last_login DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (active),
    INDEX idx_role_active (role, active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. CANDIDATE TABLE
-- Optimized with composite indexes for filtering
-- =====================================================
CREATE TABLE candidate (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    location VARCHAR(200),
    skills JSON,
    experience_years INT DEFAULT 0,
    status ENUM('INTERESTED', 'NOT_INTERESTED', 'PENDING', 'TELL_LATER', 'CONTACTED', 'OFFERED', 'HIRED') NOT NULL DEFAULT 'PENDING',
    resume_url VARCHAR(500),
    source_hr_id BIGINT NOT NULL,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_candidate_source_hr FOREIGN KEY (source_hr_id) REFERENCES account(id) ON DELETE RESTRICT,
    
    -- Critical indexes for performance
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_status (status),
    INDEX idx_source_hr (source_hr_id),
    INDEX idx_created_at (created_at),
    
    -- Composite indexes for common queries
    INDEX idx_status_created (status, created_at DESC),
    INDEX idx_hr_status (source_hr_id, status),
    INDEX idx_hr_created (source_hr_id, created_at DESC),
    
    -- Full-text index for name search
    FULLTEXT INDEX ft_idx_name (first_name, last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. CANDIDATE_HISTORY (Audit trail per candidate)
-- Write-heavy table, optimized for inserts
-- =====================================================
CREATE TABLE candidate_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_value JSON,
    new_value JSON,
    actor_id BIGINT NOT NULL,
    actor_role ENUM('ADMIN', 'HR') NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_history_candidate FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_actor FOREIGN KEY (actor_id) REFERENCES account(id) ON DELETE RESTRICT,
    
    INDEX idx_candidate_id (candidate_id),
    INDEX idx_candidate_timestamp (candidate_id, timestamp DESC),
    INDEX idx_actor_id (actor_id),
    INDEX idx_timestamp (timestamp DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. AUDIT_LOG (System-wide audit)
-- Captures all system actions
-- =====================================================
CREATE TABLE audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_name VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    action VARCHAR(50) NOT NULL,
    old_value JSON,
    new_value JSON,
    actor_id BIGINT,
    actor_role ENUM('ADMIN', 'HR', 'SYSTEM'),
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    device_info VARCHAR(255),
    correlation_id VARCHAR(36),
    
    INDEX idx_entity (entity_name, entity_id),
    INDEX idx_actor (actor_id),
    INDEX idx_timestamp (timestamp DESC),
    INDEX idx_correlation (correlation_id),
    INDEX idx_entity_timestamp (entity_name, timestamp DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. HR_PERFORMANCE_CACHE
-- Pre-computed metrics for instant dashboard loading
-- =====================================================
CREATE TABLE hr_performance_cache (
    hr_id BIGINT PRIMARY KEY,
    total_candidates BIGINT DEFAULT 0,
    interested_count BIGINT DEFAULT 0,
    not_interested_count BIGINT DEFAULT 0,
    pending_count BIGINT DEFAULT 0,
    tell_later_count BIGINT DEFAULT 0,
    contacted_count BIGINT DEFAULT 0,
    offered_count BIGINT DEFAULT 0,
    hired_count BIGINT DEFAULT 0,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_perf_cache_hr FOREIGN KEY (hr_id) REFERENCES account(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. REFRESH_TOKEN (For JWT token management)
-- =====================================================
CREATE TABLE refresh_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(500) NOT NULL UNIQUE,
    account_id BIGINT NOT NULL,
    expiry_date DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE,
    
    CONSTRAINT fk_refresh_token_account FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE,
    
    INDEX idx_token (token),
    INDEX idx_account (account_id),
    INDEX idx_expiry (expiry_date),
    INDEX idx_account_revoked (account_id, revoked)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. TOKEN_BLACKLIST (For logout management)
-- =====================================================
CREATE TABLE token_blacklist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(500) NOT NULL UNIQUE,
    expiry_date DATETIME NOT NULL,
    blacklisted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_token (token),
    INDEX idx_expiry (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INITIAL DATA - Default Admin Account
-- =====================================================
-- Password: Admin@123 (BCrypt hashed)
INSERT INTO account (username, password_hash, full_name, email, phone, role, active) 
VALUES (
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'System Administrator',
    'admin@consultancy.com',
    '+1234567890',
    'ADMIN',
    TRUE
);

-- =====================================================
-- Performance Tuning Recommendations
-- =====================================================
-- For production with >5M candidates:
-- 1. Partition candidate table by year:
--    ALTER TABLE candidate PARTITION BY RANGE (YEAR(created_at)) (
--        PARTITION p2023 VALUES LESS THAN (2024),
--        PARTITION p2024 VALUES LESS THAN (2025),
--        ...
--    );
--
-- 2. Archive old audit_log and candidate_history to separate tables
-- 3. Consider separate read-replica for analytics queries
-- 4. Enable query cache for frequently accessed data
-- =====================================================
