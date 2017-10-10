(defproject server "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [ring "1.4.0"]
                 [ring/ring-json "0.4.0"]
                 [compojure "1.4.0"]
                 [metosin/ring-http-response "0.6.5"]
                 [org.clojure/data.json "0.2.6"]
                 [clj-time "0.14.0"]
                 [luminus-migrations "0.2.2"]
                 [com.h2database/h2 "1.4.192"]
                 [conman "0.6.9"]
                 [mount "0.1.11"]
                 [cprop "0.1.8"]
                 [org.clojure/tools.logging "0.4.0"]
                 [luminus-log4j "0.1.3"]]
  :main server.core
  :plugins [[lein-cprop "1.0.1"]
            [lein-ring "0.9.7"]
            [migratus-lein "0.5.2"]]
  :ring {:handler server.core/app
         :init server.core/init}
  :migratus {:store :database
             :migration-dir "migrations"
             :db ~(get (System/getenv) "DATABASE_URL")}
  :jvm-opts ["-server" "-Dconf=.lein-env"]
  :profiles
  {:dev           [:project/dev :profiles/dev]
   :project/dev  {:resource-paths ["env/dev/resources"]}
   :profiles/dev {}
   :profiles/test {}})

