(ns server.core
  (:require [ring.adapter.jetty :as jetty]
            [compojure.core :as compojure]
            [ring.util.http-response :as response]))

(defn response-handler [request]
  (response/ok
    (str "<html><body> your IP is: "
         (:remote-addr request)
         "</body></html>")))

(compojure/defroutes handler
 (compojure/GET "/" request response-handler))

(defn -main []
  (jetty/run-jetty
      (-> #'handler)
      {:port 3000
       :join? false}))
