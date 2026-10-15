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
    virtual_balance NUMERIC(15, 2) DEFAULT 100000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
INSERT INTO users (username, email, password_hash, virtual_balance)
VALUES (
    'demo_trader',
    'trader@stockguru.com',
    '$2a$10$w09ZqW80o65VzG5T08o8e.t5kQx0n.c0Z0tQx0n.c0Z0tQx0n.c0',
    100000.00
)
ON CONFLICT (email) DO NOTHING;
