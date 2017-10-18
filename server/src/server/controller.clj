(ns server.controller
    (:require [server.db.core :as db]
              [clojure.tools.logging :as log]))

; Standard channel has a name and anyone can join, a chat is between users
; and doesn't have a name.
;
; For brevity we call a standard channel just a channel and a chat channel a chat.
(def channel-types {:standard 0 :chat 1})

(defn get-messages
  "Get messages for a channel."
  [channel-id]
  (db/get-messages
    {:channel-id channel-id}))

(defn post-message!
  "Add a new message, return all messages for the used channel."
  [author content channel-id]
  (do
    (db/save-message!
      {:author author
       :content content
       :timestamp (java.util.Date.)
       :channel-id channel-id})
    (get-messages channel-id)))

(defn get-channels
  "List all channels."
  []
  (db/get-channels {:type (:standard channel-types)}))

(defn get-user-channels
  "List all channels that the user has joined."
  [user-id]
    (db/get-user-channels
      {:user-id user-id
       :type (:standard channel-types)}))

(defn join-channel!
  "Add the user to the participants of the channel."
  [channel-id user-id]
  (do
    (db/join-channel! {:channel-id channel-id :user-id user-id})
      (get-user-channels user-id)))

(defn make-channel!
  "Make a new channel with given name an optionally a type (defaults
  to a :standard channel, returns the id of the new channel."
  ([name]
    (make-channel! name (:standard channel-types)))
  ([name type]
    ((keyword "scope_identity()")
      (db/save-channel!
        {:name name
         :type type})))))

(defn make-chat!
  "Make a new chat channel."
  []
    (make-channel! nil (:chat channel-types)))

(defn post-channel!
  "Add a new channel, join it and return all user's channels and
  the id of the new channel."
  [name user-id]  
  (let [new-channel-id (make-channel! name)]
    (let [user-channels (join-channel! new-channel-id user-id)]
      {:userChannels user-channels
       :createdChannel new-channel-id})))

(defn post-user!
  "Add a new user if a user with the same username doesn't exist yet.
  In any case return the id for the username."
  [name]  
  (if-let [userId 
    (db/get-user-id {:name name})]
    userId
    (do
      (db/save-user! {:name name})
      (db/get-user-id {:name name}))))

(defn get-users
  "Get all the users."
  []
  (db/get-users))

(defn get-user-chats
  "Get chats for given user returning a list where each item has the
  channel id of the chat and the username and user id of the other user
  in that chat.

  We change the result map names to camelCase here.
  Couldn't figure out how to get case sensitive column aliases in the
  SQL query."
  [user-id]
  (let [chats (db/get-user-channels-with-participants
    {:user-id user-id :type (:chat channel-types)})]
    (map #(clojure.set/rename-keys % 
      {:userid :userId
       :channelid :channelId})
       chats)))

(defn start-chat!
  "Start a chat with another user. Return all chats for the user."
  [another-user-id user-id]  
  (let [new-channel-id (make-chat!)]
    (do
      (join-channel! new-channel-id user-id)
      (join-channel! new-channel-id another-user-id))
      (get-user-chats user-id)))