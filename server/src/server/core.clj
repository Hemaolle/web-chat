(ns server.core
  (:require [ring.adapter.jetty :as jetty]
            [server.middleware :refer [wrap-cors]]
            [compojure.handler :as handler]
            [compojure.core :refer [routes wrap-routes]]
            [server.routes :refer [api-routes frontend-routes]]
            [ring.middleware.json :refer [wrap-json-response]]
            [server.serialization]
            [environ.core :refer [env]]))

(def app
  (routes
    frontend-routes    
    (-> #'api-routes 
      (wrap-cors)
      (wrap-json-response))
    ))

(defn init
  []
  (mount.core/start))

(defn -main []
  (do
    (init)
    (jetty/run-jetty
        (-> #'app)
        {:port (env :port)
         :join? false})))
