-- START:messages-table
CREATE TABLE messages
(id INTEGER PRIMARY KEY AUTO_INCREMENT,
 author VARCHAR(255),
 content VARCHAR,
 timestamp TIMESTAMP);
-- END:messages-table
