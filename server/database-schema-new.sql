-- Drop existing tables if they exist
DROP TABLE IF EXISTS candidate_history;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS accounts;

-- Create accounts table (renamed from users)
CREATE TABLE accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(80) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120),
    email VARCHAR(120) UNIQUE,
    phone VARCHAR(20),
    role ENUM('ADMIN','HR') NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    last_login DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Create candidates table
CREATE TABLE candidates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(80),
    last_name VARCHAR(80),
    email VARCHAR(120),
    phone VARCHAR(20),
    location VARCHAR(120),
    skills TEXT,
    resume_url VARCHAR(255),
    status ENUM('PENDING','INTERESTED','NOT_INTERESTED','TELL_LATER','CONTACTED','OFFERED','HIRED') NOT NULL DEFAULT 'PENDING',
    source_hr_id BIGINT,
    notes TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_source_hr_id (source_hr_id),
    INDEX idx_email (email),
    INDEX idx_phone (phone)
);

-- Create candidate_history table for audit
CREATE TABLE candidate_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    candidate_id BIGINT NOT NULL,
    action VARCHAR(255),
    old_value TEXT,
    new_value TEXT,
    actor_id BIGINT,
    actor_role VARCHAR(20),
    timestamp DATETIME NOT NULL,
    INDEX idx_candidate_id (candidate_id),
    INDEX idx_timestamp (timestamp)
);

-- Create refresh_tokens table
CREATE TABLE refresh_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(500) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    expiry_date DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
);

-- Insert default admin user (password: admin123)
INSERT INTO accounts (username, password_hash, full_name, email, phone, role, active, created_at, updated_at)
VALUES ('admin', '$2a$10$8Z8YN7L3K9YqN.rQf3/j7.HqfGVZ8KZxYJxQZ9X5Z8Z8Z8Z8Z8Z8Z', 'Admin User', 'admin@startica.com', '1234567890', 'ADMIN', TRUE, NOW(), NOW());

-- Insert default HR user (password: hr123)
INSERT INTO accounts (username, password_hash, full_name, email, phone, role, active, created_at, updated_at)
VALUES ('hr', '$2a$10$8Z8YN7L3K9YqN.rQf3/j7.HqfGVZ8KZxYJxQZ9X5Z8Z8Z8Z8Z8Z8Z', 'HR User', 'hr@startica.com', '0987654321', 'HR', TRUE, NOW(), NOW());

