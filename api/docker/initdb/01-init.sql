CREATE DATABASE users_emails_db;
CREATE DATABASE users_passwords_db;
CREATE DATABASE users_links_db;

-- crea usuarios y privilegios
CREATE USER auth_emails_user WITH PASSWORD 'supersecret';
GRANT ALL PRIVILEGES ON DATABASE users_emails_db TO auth_emails_user;

CREATE USER auth_pass_user WITH PASSWORD 'anothersecret';
GRANT ALL PRIVILEGES ON DATABASE users_passwords_db TO auth_pass_user;

CREATE USER auth_links_user WITH PASSWORD 'yetanothersecret';
GRANT ALL PRIVILEGES ON DATABASE users_links_db TO auth_links_user;

