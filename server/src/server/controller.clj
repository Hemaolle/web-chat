(ns server.controller
    (:require [clojure.data.json :as json]
              [server.db.core :as db]))

; Extend sql timestamp to be json serializable.
(extend-type java.sql.Timestamp
  json/JSONWriter
  (-write [date out]
  (json/-write (str date) out)))

(defn get-messages
  "Read messages from file as a string."
  []
  (json/write-str (db/get-messages)))

(defn post-message!
  "Read messages from storage, append a message with author and content,
  store the new messages in storage and return them as a string."
  [author content]
  (do
    (db/save-message!
      {:author author
       :content content
       :timestamp (java.util.Date.)})
    (get-messages)))

(defn get-channels
  "Read messages from file as a string."
  []
  (json/write-str (db/get-channels)))