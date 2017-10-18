(ns server.routes
  (:use ring.util.response)
  (:require [compojure.core :refer [defroutes GET POST wrap-routes]]
        [compojure.route :as route]
        [ring.util.http-response :as response]
        [server.controller :refer :all]))

(defroutes api-routes
  (GET "/api/channels/:channel-id/messages" [channel-id]
    (response/ok (get-messages channel-id)))
  (POST "/api/channels/:channel-id/messages" [author, content, channel-id]
    (response/ok (post-message! author content channel-id)))
  (GET "/api/channels" [] (response/ok (get-channels)))
  (POST "/api/channels" [name userId] (response/ok (post-channel! name userId)))
  (POST "/api/users" [name] (response/ok (post-user! name)))
  (GET "/api/users/:user-id/channels" [user-id]
    (response/ok (get-user-channels user-id)))
  (POST "/api/channels/:channel-id/join" [channel-id userId]
    (response/ok (join-channel! channel-id userId)))
  (GET "/api/users" [] response/ok (get-users))
  (POST "/api/users/:another-user-id/start_chat"
    [another-user-id userId]
    (response/ok (start-chat! another-user-id userId)))
  (GET "/api/users/:user-id/chats" [user-id]
    response/ok (get-user-chats user-id)))

(defroutes frontend-routes
  (GET "/" [] (resource-response "index.html" {:root "public"}))
  (route/resources "/"))