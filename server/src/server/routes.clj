(ns server.routes
  (:use ring.util.response)
  (:require [compojure.core :refer [defroutes GET POST]]
  			[compojure.route :as route]
  			[ring.util.http-response :as response]
        [server.controller :refer :all]))

(defroutes api-routes
  (GET "/api/messages" [] (response/ok (get-messages)))
  (POST "/api/message" [author, content]
    (response/ok (post-message! author content)))
  (GET "/api/channels" [] (response/ok (get-channels)))
  (POST "/api/channel" [name]
    (response/ok (post-channel! name))))

(defroutes frontend-routes
  (GET "/" [] (resource-response "index.html" {:root "public"}))
  (route/resources "/")
  (route/not-found "Page not found"))