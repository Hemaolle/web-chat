(ns server.routes
  (:use ring.util.response)
  (:require [compojure.core :refer [defroutes GET POST wrap-routes]]
  			[compojure.route :as route]
  			[ring.util.http-response :as response]
        [server.controller :refer :all]
        [ring.middleware.params :refer [wrap-params]]
        [ring.middleware.json :refer [wrap-json-params]]))

(defroutes api-routes
  (wrap-routes (GET "/api/messages" [channelId] 
      (response/ok (get-messages channelId))) wrap-params)
  (wrap-routes (POST "/api/message" [author, content, channelId]
    (response/ok (post-message! author content channelId))) wrap-json-params)
  (GET "/api/channels" [] (response/ok (get-named-channels)))
  (wrap-routes (POST "/api/channel" [name userId]
    (response/ok (post-channel! name userId))) wrap-json-params)
  (wrap-routes (POST "/api/user" [name]
    (response/ok (post-user! name))) wrap-json-params)
  (GET "/api/user/:user-id/channels" [user-id]
    (response/ok (get-user-named-channels user-id)))
  (wrap-routes (POST "/api/channel/:channelId/join" [channelId userId]
    (response/ok (join-channel! channelId userId))) wrap-json-params)
  (GET "/api/users" [] response/ok (get-users))
  (wrap-routes (POST "/api/user/:another-user-id/start_chat"
    [another-user-id user-id]
    (response/ok (start-user-chat! another-user-id user-id))) wrap-json-params))

(defroutes frontend-routes
  (GET "/" [] (resource-response "index.html" {:root "public"}))
  (route/resources "/")
  (route/not-found "Page not found"))