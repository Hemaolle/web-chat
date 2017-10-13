-- START:users-table
CREATE TABLE users
(id INTEGER PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(255));
--;;
INSERT INTO users (name)
SELECT DISTINCT author FROM messages;
--;;
ALTER TABLE messages
  ADD author_id INTEGER;
--;;
ALTER TABLE messages
  ADD FOREIGN KEY (author_id) REFERENCES public.users(id);
--;;
UPDATE messages 
SET author_id=
(SELECT users.id 
  FROM users
    WHERE users.name=messages.author);
--;;
ALTER TABLE messages
DROP COLUMN author;
--END:users-table