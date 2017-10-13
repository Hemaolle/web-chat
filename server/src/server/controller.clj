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

(defn post-channel!
  "Add a new channel"
  [name]
  (do
    (db/save-channel!
      {:name name})
    (get-channels)))

(defn post-user!
  "Add a new user if a user with the same username doesn't exist yet.
  In any case return the id for the username."
  [name]
  (json/write-str
    {:userId 
      (if-let [userId 
        (db/get-user-id {:name name})]
        userId
        (do
          (db/save-user! {:name name})
          ((db/get-user-id {:name name}))))
    }))

