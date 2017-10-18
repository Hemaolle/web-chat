(ns server.routes
  (:use ring.util.response)
  (:require [compojure.core :refer [defroutes GET POST wrap-routes]]
  			[compojure.route :as route]
  			[ring.util.http-response :as response]
        [server.controller :refer :all]))

(defroutes api-routes
  (GET "/api/messages" [channelId] (response/ok (get-messages channelId)))  
  (POST "/api/message" [author, content, channelId]
    (response/ok (post-message! author content channelId)))  
  (GET "/api/channels" [] (response/ok (get-named-channels)))  
  (POST "/api/channel" [name userId] (response/ok (post-channel! name userId)))  
  (POST "/api/user" [name] (response/ok (post-user! name)))
  (GET "/api/user/:user-id/channels" [user-id]
    (response/ok (get-user-named-channels user-id)))
  (POST "/api/channel/:channelId/join" [channelId userId]
    (response/ok (join-channel! channelId userId)))
  (GET "/api/users" [] response/ok (get-users))
  (POST "/api/user/:another-user-id/start_chat"
    [another-user-id userId]      
    (response/ok (start-user-chat! another-user-id userId)))
  (GET "/api/user/:user-id/chats" [user-id]
    response/ok (get-user-chats user-id)))

(defroutes frontend-routes
  (GET "/" [] (resource-response "index.html" {:root "public"}))
  (route/resources "/"))