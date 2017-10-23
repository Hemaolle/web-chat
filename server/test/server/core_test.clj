(ns server.core-test
  (:require [clojure.test :refer :all]
            [server.core :refer :all]
            [ring.mock.request :as mock]
            [clojure.tools.logging :as log]
            [clojure.data.json :as json]))

(defn mock-get-users
  []
  '({:id 1 :name "Steve"},
    {:id 2 :name "Bill"}))

(deftest get-users-test  
  (with-redefs [server.db.core/get-users mock-get-users]
    (let [response (app (mock/request :get "/api/users"))]
      (log/info response)
      (is (= 200 (:status response)))
      (is (= [{"id" 1, "name" "Steve"}, {"id" 2, "name" "Bill"}]
        (json/read-str (:body response)))))))
