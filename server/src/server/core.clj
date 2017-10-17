(ns server.core
  (:require [ring.adapter.jetty :as jetty]
            [server.middleware :refer [wrap-cors]]
            [compojure.handler :as handler]
            [compojure.core :refer [routes wrap-routes]]
            [server.routes :refer [api-routes frontend-routes]]
            [ring.middleware.json :refer [wrap-json-response]]
            [server.serialization]
            [server.config :refer [env]]
            [migratus.core :as migratus])
  (:gen-class))

(def app
  (routes
    frontend-routes    
    (-> #'api-routes 
      (wrap-cors)
      (wrap-json-response))
    ))

(defn migratus-conf
  []
 {:store :database
  :migration-dir "migrations"
  :db (env :database-url)})

(defn init
  []  
  (mount.core/start)

  ; We run the migrations here to initialize the embedded H2 database
  ; on Heroku as it's not possible to access the dyno running the app
  ; there to migrate manually.
  ;
  ; Should change to PostgreSQL to be able to use a plugin on Heroku
  ; because the embedded db will be wiped every time the dyno is cycled.
  (migratus/migrate (migratus-conf)))

(defn -main []
  (do
    (init)
    (jetty/run-jetty
        (-> #'app)
        {:port (env :port)
         :join? false})))
