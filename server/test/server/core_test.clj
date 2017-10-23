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

(def mock-users (atom ()))

(defn mock-get-user-id
  [args]
  (if-let [id (:id 
                (first
                  (filter #(= (:name %) (:name args)) @mock-users)))]
    {:id id}
    nil))

(def new-user-id 43)

(defn mock-save-user!
  [args]
  (log/info (str "logging mock users" @mock-users))
  (swap! mock-users
    (fn [current-users]
      (conj current-users {:id new-user-id :name (:name args)})))
  (log/info (str "logging mock users" @mock-users)))

(defn mock-join-channel!
  [channel-id user-id])

(deftest post-existing-user-test
  (with-redefs[server.db.core/get-user-id mock-get-user-id
               server.db.core/save-user! mock-save-user!
               server.controller/join-channel! mock-join-channel!]
    (reset! mock-users '({:id 3 :name "Steve"}))
    (let [response
      (app
        (mock/body
          (mock/request :post "/api/users")
          {:name "Steve"}))]
      (log/info response)
      (is (= 200 (:status response)))
      (is (= {"id" 3} 
        (json/read-str (:body response)))))))

(deftest post-new-user-test
  (with-redefs[server.db.core/get-user-id mock-get-user-id
               server.db.core/save-user! mock-save-user!
               server.controller/join-channel! mock-join-channel!]
    (reset! mock-users '({:id 3 :name "Steve"}))
    (let [response
      (app
        (mock/body
          (mock/request :post "/api/users")
          {:name "bar"}))]
      (log/info response)
      (is (= 200 (:status response)))
      (is (= {"id" new-user-id} 
        (json/read-str (:body response)))))))