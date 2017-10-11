(ns server.routes
  (:use ring.util.response)
  (:require [compojure.core :refer [defroutes GET POST]]
  			[compojure.route :as route]
  			[ring.util.http-response :as response]
        [server.controller :refer [post-message! get-messages get-channels]]))

(defroutes api-routes
  (GET "/api/messages" [] (response/ok (get-messages)))
  (POST "/api/message" [author, content]
    (response/ok (post-message! author content)))
  (GET "/api/channels" [] (response/ok (get-channels))))

(defroutes frontend-routes
  (GET "/" [] (resource-response "index.html" {:root "public"}))
  (route/resources "/")
  (route/not-found "Page not found"))