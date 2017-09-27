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

(def app
  (routes    
    #'api-routes
    (handler/api frontend-routes)))

(defn -main []
  (jetty/run-jetty
      (-> #'app)
      {:port 3000
       :join? false}))
