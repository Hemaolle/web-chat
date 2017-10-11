(ns server.middleware)

(defn wrap-cors
  "Allow requests from all origins. This makes client development 
  easier as we're able to run in development mode on a different
  server."
  ; TODO: could perhaps make this used only in dev env.
  [handler]
  (fn [request]
    (let [response (handler request)]
      (-> response
        (assoc-in [:headers "Access-Control-Allow-Origin"] "*")
        (assoc-in [:headers "Access-Control-Allow-Headers"] "Content-Type")))))