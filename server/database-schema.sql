-- ============================================================================
-- DATABASE SETUP SCRIPT FOR privateappdb
-- ============================================================================
-- This script is for MySQL. H2 auto-creates tables, so this is optional.
-- Use this if you want to manually create the database structure in MySQL.
-- ============================================================================

-- Create database (if using MySQL)
CREATE DATABASE IF NOT EXISTS privateappdb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE privateappdb;

-- ============================================================================
-- TABLE: users
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_role CHECK (role IN ('ADMIN', 'HR'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INDEXES (for better query performance)
-- ============================================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- SAMPLE QUERIES
-- ============================================================================

-- View all users
-- SELECT * FROM users;

-- Find user by email
-- SELECT * FROM users WHERE email = 'admin@startica.com';

-- Count users by role
-- SELECT role, COUNT(*) as user_count FROM users GROUP BY role;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. The application auto-creates these tables via Hibernate (spring.jpa.hibernate.ddl-auto=update)
-- 2. Initial users (admin and HR) are created by DataInitializer.java on startup
-- 3. Passwords are stored as BCrypt hashes, not plain text
-- 4. For H2 in-memory database, this script is not needed
-- ============================================================================

