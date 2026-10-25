-- Fresh StockFlow database only. Do not apply this baseline to an existing StockFlow
-- database that contains legacy product/supplier data. Plan imports separately.
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
