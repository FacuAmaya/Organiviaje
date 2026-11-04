-- Se ejecuta solo la primera vez que se crea el volumen de Postgres.
-- Base separada para los tests de integración: nunca se testea contra la base de desarrollo.
CREATE DATABASE organiviaje_test;
