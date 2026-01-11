CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    upload_id UUID ,

    date TEXT,
    description TEXT,
    amount NUMERIC,
    transaction_type TEXT,
    category TEXT,

    raw_json JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transactions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_transactions_user_upload
ON transactions(user_id, upload_id);

CREATE TABLE expense_analyses (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    upload_id UUID ,

    summary JSONB NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_expense_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_expense_user_upload
ON expense_analyses(user_id, upload_id);

CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    upload_id UUID ,

    alert_type TEXT,
    severity TEXT,
    message TEXT,
    recommendations JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_alerts_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_alerts_user_upload
ON alerts(user_id, upload_id);

CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,

    purpose TEXT,
    amount NUMERIC,
    months INT,
    plan JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_goals_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_goals_user
ON goals(user_id);

CREATE TABLE user_category_memory (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    merchant_pattern TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, merchant_pattern)
);


INSERT INTO transactions (
    user_id,
    upload_id,
    date,
    description,
    amount,
    transaction_type,
    category,
    raw_json
) VALUES
(
    'd8f24ba0-b99d-4433-be84-7959d5298ff0',
    '11111111-2222-3333-4444-555555555555',
    '2025-01-01',
    'Salary credited',
    60000.00,
    'credit',
    'Income',
    '{"bank": "HDFC", "mode": "NEFT", "reference": "SAL_JAN_2025"}'
),
(
    'd8f24ba0-b99d-4433-be84-7959d5298ff0',
    '11111111-2222-3333-4444-555555555555',
    '2025-01-03',
    'Rent payment',
    18000.00,
    'debit',
    'Rent',
    '{"payment_method": "UPI", "to": "Landlord"}'
),
(
    'd8f24ba0-b99d-4433-be84-7959d5298ff0',
    '11111111-2222-3333-4444-555555555555',
    '2025-01-05',
    'Grocery shopping',
    2450.75,
    'debit',
    'Groceries',
    '{"store": "Reliance Fresh", "payment_method": "Card"}'
),
(
    'd8f24ba0-b99d-4433-be84-7959d5298ff0',
    '11111111-2222-3333-4444-555555555555',
    '2025-01-07',
    'Electricity bill payment',
    1650.00,
    'debit',
    'Utilities',
    '{"provider": "BESCOM", "bill_month": "Dec 2024"}'
),
(
    'd8f24ba0-b99d-4433-be84-7959d5298ff0',
    '11111111-2222-3333-4444-555555555555',
    '2025-01-09',
    'Mobile recharge',
    599.00,
    'debit',
    'Telecom',
    '{"operator": "Jio", "plan": "Prepaid 28 days"}'
),
(
    'd8f24ba0-b99d-4433-be84-7959d5298ff0',
    '11111111-2222-3333-4444-555555555555',
    '2025-01-12',
    'Restaurant payment',
    1350.40,
    'debit',
    'Food',
    '{"restaurant": "Barbeque Nation", "payment_method": "UPI"}'
),
(
    'd8f24ba0-b99d-4433-be84-7959d5298ff0',
    '11111111-2222-3333-4444-555555555555',
    '2025-01-15',
    'Fuel purchase',
    2100.00,
    'debit',
    'Transport',
    '{"station": "IndianOil", "vehicle": "Car"}'
),
(
    'd8f24ba0-b99d-4433-be84-7959d5298ff0',
    '11111111-2222-3333-4444-555555555555',
    '2025-01-20',
    'Interest credited',
    325.60,
    'credit',
    'Interest',
    '{"bank": "HDFC", "account": "Savings"}'
);
