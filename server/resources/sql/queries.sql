-- :name save-message! :! :n
-- :doc creates a new message using the author, content, and timestamp keys
INSERT INTO messages
(author, content, timestamp, channel_id)
VALUES (:author, :content, :timestamp, :channel-id)

-- :name get-messages :? :*
-- :doc find messages for a matching channel id.
SELECT *
FROM messages
WHERE channel_id = :channel-id

-- :name save-channel! :! :n
-- :doc creates a new channel using the channel name key
INSERT INTO channels
(name)
VALUES (:name)

-- :name get-channels :? :*
-- :doc selects all available channels
SELECT * from channels
