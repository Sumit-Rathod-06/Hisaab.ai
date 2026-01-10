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
