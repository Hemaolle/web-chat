# Web-chat

A simple Slack clone with a Clojure backend and a React client

## Requirements

- Node.js
- npm
- Leiningen

## Development

API:
```
# Run the API on port 3001 (The client assumes this port in development, you can
# change that in client/.env.development). Using lein-ring applies code changes
# immediately.
#
# This should also run all the database migrations. For fine grained control over
# the migrations use the lein migratus command. 
cd server
lein ring server 3001
```

Client:
```
# Install npm packages.
# (Note for Windows users: You might run into this issue with npm install:
# https://github.com/npm/npm/issues/17671. Retrying worked for me.)
cd client
npm install

# Run the client on dev server. It's also reloaded immediately on file changes.
# The browser window should open automatically and the client address
# should be also output to the terminal.
npm run start

```

## Deploying to Heroku

You should have the Heroku CLI installed.

Note that as the server is using an embedded H2 database, the contents of
the database will be wiped every time the Heroku dyno is reloaded.
We should switch to a database with Heroku add-on support if we wanted
the data to persist.
 
```
# Build the client.
# (Note for Windows users: You might run into this issue with npm install:
# https://github.com/npm/npm/issues/17671. Retrying worked for me.)
cd client
npm install
npm run build

# Copy the client build to the public server resources directory.
cp -a build/. ../server/resources/public/

cd ../server/

# Deploy the server to Heroku using git. I'm creating a git repository
# inside the main repository here to avoid committing the client build to the
# main repository. Also, a Heroku app has to be in root of the repository,
# although that you could work around like this:
# https://coderwall.com/p/ssxp5q/heroku-deployment-without-the-app-being-at-the-repo-root-in-a-subfolder

git init
git add .
git commit -m "First Heroku deployment"

# Create the Heroku app (replace web-chat with whatever you want to call the app)
heroku create web-chat

# Push the repository
git push heroku master

# The app should be up and running. Open it in the browser:
heroku open
```
