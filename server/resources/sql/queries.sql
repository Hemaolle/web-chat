-- :name save-message! :! :n
-- :doc creates a new message using the author, content, and timestamp keys
INSERT INTO messages
(author, content, timestamp)
VALUES (:author, :content, :timestamp)

-- :name get-messages :? :*
-- :doc selects all available messages
SELECT * from messages

-- :name get-channels :? :*
-- :doc selects all available channels
SELECT * from channels
