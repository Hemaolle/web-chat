(ns server.core
  (:use ring.util.response)
  (:require [ring.adapter.jetty :as jetty]
            [ring.middleware.json :refer [wrap-json-params]]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [compojure.core :refer [defroutes routes GET POST wrap-routes]]
            [ring.util.http-response :as response]
            [clojure.data.json :as json]            
            [server.db.core :as db]))

; Extend sql timestamp to be json serializable.
(extend-type java.sql.Timestamp
  json/JSONWriter
  (-write [date out]
  (json/-write (str date) out)))

(defn read-messages
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
    (read-messages)))

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

(defn init
  []
  (mount.core/start))

(defn -main []
  (do
    (init)
    (jetty/run-jetty
        (-> #'app)
        {:port 3001
         :join? false})))
