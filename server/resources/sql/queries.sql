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

-- :name save-channel! :insert
/* :doc
Creates a new channel using the channel name and type, returns
the id of the new channel (with H2 db engine the result
is of from {:scope_identity() id}). Type is an int: 0 is a
regular channel, 1 a user chat (unnamed).
*/ 
INSERT INTO channels
(name, type)
VALUES (:name, :type)

-- :name get-channels :? :*
-- :doc selects all available channels of given type.
SELECT * from channels
WHERE type=:type

-- :name get-user-channels :? :*
/* :doc
Selectes channels that user has joined of given type.
Type is an int: 0 is a regular channel, 1 a user chat (unnamed).
*/
SELECT channels.id, channels.name from channels
INNER JOIN channelsUsers ON channels.id=channelsUsers.channel_id
WHERE channelsUsers.user_id=:user-id AND channels.type=:type

-- :name get-user-channels-with-participants :? :*
/* :doc
Selects a list of other users that the user with user-id is chatting
with on channels of type channel-type. Also the corresponding chat id
for each user is provided.
*/
SELECT
  channelsUsers.channel_id as channelid,
  users.name as username,
  users.id as userid
  FROM channelsUsers
  INNER JOIN users ON channelsUsers.user_id=users.id
  INNER JOIN channels on channelsUsers.channel_id=channels.id
  WHERE channelsUsers.channel_id in
    (SELECT channel_id
      FROM channelsUsers
      WHERE user_id=:user-id)
    AND NOT channelsUsers.user_id=:user-id
    AND channels.type=:type

-- :name join-channel! :! :n
-- :doc adds the user-id - channel-id relationship.
INSERT INTO channelsUsers
(user_id, channel_id)
VALUES (:user-id, :channel-id)

-- :name save-user! :! :n
-- :doc saves a new user using the name key
INSERT INTO users
(name)
VALUES (:name)

-- :name get-user-id :? :1
SELECT id from users
WHERE name = :name

-- :name get-users :? :*
SELECT * from users