-- gott að hafa aðgerðir sem við viljum keyra oft í skriptm eins og þessari
-- keyrist með t.d. `psql vef2 < create.sql`
DROP ROLE IF EXISTS "vef2-user";
CREATE USER "vef2-user" WITH ENCRYPTED PASSWORD '123';
GRANT ALL PRIVILEGES ON DATABASE vef2 TO "vef2-user";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "vef2-user";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "vef2-user";
