(ns server.core
  (:use ring.util.response)
  (:require [ring.adapter.jetty :as jetty]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [compojure.core :refer [defroutes routes GET]]
            [ring.util.http-response :as response]))

(defroutes api-routes
  (GET "/api" [] (response/ok "Api here")))

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
      (update-in response
                 [:headers "Access-Control-Allow-Origin"]
                 (fn [_] "*")))))

(def app
  (routes    
    (wrap-cors #'api-routes)
    (handler/api frontend-routes)))

(defn -main []
  (jetty/run-jetty
      (-> #'app)
      {:port 3001
       :join? false}))
