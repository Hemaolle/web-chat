(ns server.serialization
  (:require [clojure.data.json :as json]))

; Extend sql timestamp to be json serializable.
(extend-type java.sql.Timestamp
  json/JSONWriter
  (-write [date out]
  (json/-write (str date) out)))