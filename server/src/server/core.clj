(ns server.core
  (:use ring.util.response)
  (:require [ring.adapter.jetty :as jetty]
            [ring.middleware.json :refer [wrap-json-params]]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [compojure.core :refer [defroutes routes GET POST wrap-routes]]
            [ring.util.http-response :as response]
            [clojure.java.io :as io]
            [clojure.data.json :as json]
            [clj-time.core :as time]
            [clj-time.format :as format-time]))

(def message-file "messages.json")
(def time-formatter (format-time/formatters :basic-date-time))

(defn read-messages
  "Read messages from file as a string."
  []
  (-> message-file
    (io/resource)
    (slurp)))

(defn uuid [] (str (java.util.UUID/randomUUID)))

(defn append-message
  "Append a new message to a list of messages."
  [messages author content]  
  (conj messages
        {:sender author
         :content content
         :timestamp (format-time/unparse time-formatter (time/now))
         :id (uuid)}))

(defn save-messages!
  "Save a string to the messages file"
  [messages]
  (spit (io/resource message-file) messages))

(defn post-message!
  "Read messages from storage, append a message with author and content,
  store the new messages in storage and return them as a string."
  [author content]
  (let [new-messages-str
           (-> (read-messages)
           (json/read-str)
           (append-message author content)
           (json/write-str))]
    (do
      (save-messages! new-messages-str)
      new-messages-str)))

(defroutes api-routes
  (GET "/api/messages" [] (response/ok (read-messages)))
  (POST "/api/message" [author, content]
    (response/ok (post-message! author content))))

(defroutes frontend-routes
  (GET "/" [] (resource-response "index.html" {:root "public"}))
  (route/resources "/")
  (route/not-found "Page not found"))

(defn wrap-cors
  "Allow requests from all origins. This makes client development 
  easier as we're able to run in development mode on a different
  server."
  ; TODO: could perhaps make this used only in dev env.
  [handler]
  (fn [request]
    (let [response (handler request)]
      (-> response
        (assoc-in [:headers "Access-Control-Allow-Origin"] "*")
        (assoc-in [:headers "Access-Control-Allow-Headers"] "Content-Type")))))

(def app
  (routes    
    (-> #'api-routes 
      (wrap-cors)
      (wrap-json-params))
    ; TODO: handler/api is deprecated and probably doesn't make sense for the frontend
    ; anyway.
    (handler/api frontend-routes)))

(defn -main []
  (jetty/run-jetty
      (-> #'app)
      {:port 3001
       :join? false}))
