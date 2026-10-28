-- SQL: DDL, joins, functions, variables, string literals, numeric.
CREATE TABLE themes (id INTEGER PRIMARY KEY, name VARCHAR(120), enabled BOOLEAN);
INSERT INTO themes (id, name, enabled) VALUES (1, 'Obsidian Cream', TRUE);
SELECT name, COUNT(*) AS count FROM themes WHERE enabled = TRUE GROUP BY name ORDER BY count DESC;
