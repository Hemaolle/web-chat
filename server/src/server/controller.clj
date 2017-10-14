(ns server.controller
    (:require [clojure.data.json :as json]
              [server.db.core :as db]
              [clojure.tools.logging :as log]))

; Extend sql timestamp to be json serializable.
(extend-type java.sql.Timestamp
  json/JSONWriter
  (-write [date out]
  (json/-write (str date) out)))

(defn get-messages
  "Get messages for a channel as a string"
  [channel-id]
  (json/write-str
    (db/get-messages
      {:channel-id channel-id})))

(defn post-message!
  "Add a new message, return all messages for the used channel as a string."
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
  (json/write-str (db/get-channels)))

(defn get-user-channels
  [user-id]
  (json/write-str (db/get-user-channels {:user-id user-id})))

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
      (json/write-str {:userChannels (json/read-str user-channels)
       :createdChannel new-channel-id}))))

(defn post-user!
  "Add a new user if a user with the same username doesn't exist yet.
  In any case return the id for the username."
  [name]
  (json/write-str
    (if-let [userId 
      (db/get-user-id {:name name})]
      userId
      (do
        (db/save-user! {:name name})
        ((db/get-user-id {:name name}))))))
