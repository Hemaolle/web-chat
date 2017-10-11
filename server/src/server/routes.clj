(ns server.routes
  (:use ring.util.response)
  (:require [compojure.core :refer [defroutes GET POST]]
  			[compojure.route :as route]
  			[ring.util.http-response :as response]
        [server.controller :refer [post-message! read-messages]]))

(defroutes api-routes
  (GET "/api/messages" [] (response/ok (read-messages)))
  (POST "/api/message" [author, content]
    (response/ok (post-message! author content))))

(defroutes frontend-routes
  (GET "/" [] (resource-response "index.html" {:root "public"}))
  (route/resources "/")
  (route/not-found "Page not found"))