-- :name save-message! :! :n
-- :doc creates a new message using the author, content, and timestamp keys
INSERT INTO messages
(author_id, content, timestamp, channel_id)
VALUES (
  (SELECT id FROM users WHERE users.name=:author),
  :content, :timestamp, :channel-id)

-- :name get-messages :? :*
-- :doc find messages for a matching channel id.
SELECT messages.id, messages.content, messages.timestamp, users.name as author
FROM messages
INNER JOIN users ON messages.author_id=users.id
WHERE channel_id = :channel-id

-- :name save-channel! :! :n
-- :doc creates a new channel using the channel name key
INSERT INTO channels
(name)
VALUES (:name)

-- :name get-channels :? :*
-- :doc selects all available channels
SELECT * from channels

-- :name save-user! :! :n
-- :doc saves a new user using the name key
INSERT INTO users
(name)
VALUES (:name)

-- :name get-user-id :? :1
SELECT id from users
WHERE name = :name