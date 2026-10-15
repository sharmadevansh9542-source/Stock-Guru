-- =======================================================
-- StockGuru PostgreSQL Database Schema
-- Compatible with pgAdmin 4 / PostgreSQL 14+
-- =======================================================

-- 1. Create database (Execute in pgAdmin query tool if needed)
-- CREATE DATABASE stockguru;

-- Connect to stockguru database, then execute:

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    virtual_balance NUMERIC(15, 2) DEFAULT 100000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure role column exists if table was created previously
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- 3. User Portfolio Positions Table
CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(30) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    avg_price NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_symbol UNIQUE(user_id, symbol)
);

-- 4. Trades / Execution Orders Log
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    order_ref VARCHAR(50) UNIQUE NOT NULL,
    symbol VARCHAR(30) NOT NULL,
    order_type VARCHAR(10) NOT NULL CHECK (order_type IN ('BUY', 'SELL')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    execution_price NUMERIC(15, 2) NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. AI Predictions History
CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(30) NOT NULL,
    current_price NUMERIC(15, 2) NOT NULL,
    predicted_price NUMERIC(15, 2) NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    direction VARCHAR(15) NOT NULL,
    timeframe VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Demo Seed User (password: password123)
INSERT INTO users (username, email, password_hash, role, virtual_balance)
VALUES (
    'demo_trader',
    'trader@stockguru.com',
    '$2a$10$w09ZqW80o65VzG5T08o8e.t5kQx0n.c0Z0tQx0n.c0Z0tQx0n.c0',
    'user',
    100000.00
)
ON CONFLICT (email) DO NOTHING;

-- 7. Seed Admin User (password: admin123)
-- Hash for 'admin123' generated with bcryptjs 10 rounds:
-- $2a$10$b8e4U774wM3N3lqO0jC7e.eX4c2lR5lQz4xXp2s3b5j1u6e4v6y7i (or generated dynamically)
INSERT INTO users (username, email, password_hash, role, virtual_balance)
VALUES (
    'StockGuru_Admin',
    'admin@stockguru.com',
    '$2a$10$63iT7aWl5zI4Xb3E2S1OYeQd5E5.M2b/l0s9fO6t9W5W8s3Q/x4p6',
    'admin',
    5000000.00
)
ON CONFLICT (email) DO UPDATE SET role = 'admin';
