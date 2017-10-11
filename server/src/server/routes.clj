(ns server.routes
  (:use ring.util.response)
  (:require [compojure.core :refer [defroutes GET POST]]
  			[compojure.route :as route]
  			[ring.util.http-response :as response]
        [server.controller :refer :all]
        [ring.middleware.params :refer [wrap-params]]
        [ring.middleware.json :refer [wrap-json-params]]))

(defroutes api-routes
  (wrap-params (GET "/api/messages" [channelId] 
      (response/ok (get-messages channelId))))
  (wrap-json-params (POST "/api/message" [author, content, channelId]
    (response/ok (post-message! author content channelId))))
  (GET "/api/channels" [] (response/ok (get-channels)))
  (wrap-json-params (POST "/api/channel" [name]
    (response/ok (post-channel! name)))))

(defroutes frontend-routes
  (GET "/" [] (resource-response "index.html" {:root "public"}))
  (route/resources "/")
  (route/not-found "Page not found"))