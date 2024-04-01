-- Create a new role if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'growth_user') THEN
    CREATE ROLE growth_user WITH LOGIN PASSWORD 'growth_user_pwd' CREATEDB CREATEROLE;
  END IF;
END $$;

-- Create a new database if not exists
-- DO $$ BEGIN
--  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'growth_db') THEN
--    CREATE DATABASE growth_db OWNER growth_user;
--  END IF;
--END $$;

CREATE DATABASE growth_db OWNER growth_user;


-- Connect to the new database
\c growth_db;

-- Create a users table if not exists
CREATE TABLE IF NOT EXISTS users (
    email text NOT NULL PRIMARY KEY,
    password text
);
