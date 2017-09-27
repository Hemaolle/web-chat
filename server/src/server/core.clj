(ns server.core
  (:use ring.util.response)
  (:require [ring.adapter.jetty :as jetty]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [compojure.core :as compojure]
            [ring.util.http-response :as response]))

(compojure/defroutes app-routes
  (compojure/GET "/" [] (resource-response "index.html" {:root "public"}))
  (route/resources "/")
  (route/not-found "Page not found"))

(def app
  (handler/api app-routes))

(defn -main []
  (jetty/run-jetty
      (-> #'app)
      {:port 3000
       :join? false}))
