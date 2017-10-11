(ns server.core
  (:require [ring.adapter.jetty :as jetty]
            [ring.middleware.json :refer [wrap-json-params]]
            [compojure.handler :as handler]
            [compojure.core :refer [routes]]
            [server.middleware :refer [wrap-cors]]
            [server.routes :refer [api-routes frontend-routes]]))

(def app
  (routes    
    (-> #'api-routes 
      (wrap-cors)
      (wrap-json-params))
    ; TODO: handler/api is deprecated and probably doesn't make sense for the frontend
    ; anyway.
    (handler/api frontend-routes)))

(defn init
  []
  (mount.core/start))

(defn -main []
  (do
    (init)
    (jetty/run-jetty
        (-> #'app)
        {:port 3001
         :join? false})))
