

DO $$ 
BEGIN
    -- Kiểm tra xem role 'postgres' đã tồn tại chưa, nếu chưa thì tạo mới
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres') THEN
        CREATE ROLE postgres WITH LOGIN PASSWORD '123456';
    END IF;
    
    -- Kiểm tra xem database 'mydatabase' đã tồn tại chưa, nếu chưa thì tạo mới
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'postgres_url') THEN
        CREATE DATABASE postgres_url;
    END IF;
END
$$;

-- Cấp quyền tất cả cho role 'postgres' trên database 'mydatabase'
GRANT ALL PRIVILEGES ON DATABASE postgres_url TO postgres;
