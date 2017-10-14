(ns server.controller
    (:require [server.db.core :as db]
              [clojure.tools.logging :as log]))

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
  (db/get-channels))

(defn get-user-channels
  [user-id]
  (db/get-user-channels {:user-id user-id}))

(defn join-channel!
  "Add the user to the participants of the channel"
  [channel-id user-id]
  (do
    (db/join-channel! {:channel-id channel-id :user-id user-id})
    (get-user-channels user-id)))

(defn post-channel!
  "Add a new channel, join it and return all user's channels and
  the id of the new channel."
  [name user-id]  
  (let [new-channel-id ((keyword "scope_identity()")
                          (db/save-channel!
                          {:name name}))]
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
      ((db/get-user-id {:name name})))))

(defn get-users
  []
  (db/get-users))