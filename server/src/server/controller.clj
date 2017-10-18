(ns server.controller
    (:require [server.db.core :as db]
              [clojure.tools.logging :as log]))

; Standard channel has a name and anyone can join, a chat is between users
; and doesn't have a name.
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
  "List all channels of given type (default to :standard)."
  ([]
    (get-channels (:standard channel-types)))
  ([type]
    (db/get-channels {:type type})))

(defn get-user-channels
  ([user-id]
    (get-user-channels user-id (:standard channel-types)))
  ([user-id type]
    (db/get-user-channels
      {:user-id user-id
       :type type})))

(defn get-user-chats
  [user-id]
  (get-user-channels user-id (:chat channel-types)))

(defn join-channel!
  "Add the user to the participants of the channel"
  [channel-id user-id]
  (do
    (db/join-channel! {:channel-id channel-id :user-id user-id})
      (get-user-channels user-id (:standard channel-types))))

(defn make-channel!
  "Makes a new channel of , returns the id."
  [name type]
    ((keyword "scope_identity()")
      (db/save-channel!
        {:name name
         :type type})))

(defn post-channel!
  "Add a new channel, join it and return all user's channels and
  the id of the new channel."
  [name user-id]  
  (let [new-channel-id (make-channel! name (:standard channel-types))]
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
  []
  (db/get-users))

(defn get-user-chats-with-participants
  "Get user chats. We change the result map names to camelCase here.
  Couldn't figure out how to get case sensitive column aliases in the
  SQL query."
  [user-id]
  (let [chats (db/get-user-channels-with-participants
    {:user-id user-id :type (:chat channel-types)})]
    (map #(clojure.set/rename-keys % 
      {:userid :userId
       :channelid :channelId})
       chats)))

(defn start-user-chat!
  [another-user-id user-id]  
  (let [new-channel-id (make-channel! nil (:chat channel-types))]
    (do
      (join-channel! new-channel-id user-id)
      (join-channel! new-channel-id another-user-id))
      (get-user-chats-with-participants user-id)))