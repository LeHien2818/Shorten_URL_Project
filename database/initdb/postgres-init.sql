-- init.sql
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres') THEN
        CREATE ROLE postgres WITH LOGIN PASSWORD '123456';
    END IF;
END
$$;

GRANT ALL PRIVILEGES ON DATABASE mydatabase TO postgres;