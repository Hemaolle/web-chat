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
  (GET "/api/channels" [] (response/ok (get-channels)))
  (wrap-routes (POST "/api/channel" [name]
    (response/ok (post-channel! name))) wrap-json-params))

(defroutes frontend-routes
  (GET "/" [] (resource-response "index.html" {:root "public"}))
  (route/resources "/")
  (route/not-found "Page not found"))