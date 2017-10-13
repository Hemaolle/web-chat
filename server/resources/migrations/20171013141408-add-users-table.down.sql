ALTER TABLE messages
ADD COLUMN author;
--;;
UPDATE messages
SET author =
(SELECT users.name
  FROM users
    WHERE users.id=messages.author_id);
--;;
ALTER TABLE messages
DROP COLUMN author_id;
--;;
DROP TABLE users;
