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
cd server
lein ring server 3001
```

Client:
```
# Install npm packages
# (Note for Windows users: You might run into this issue with npm install:
# https://github.com/npm/npm/issues/17671. Retrying worked for me.)
cd client
npm install

# Run the client on dev server. It also reloads immediately on changes.
# The browser window should open automatically and the client address
# should be output to terminal also.
npm run start

```

## Deploying to Heroku

You should have the Heroku CLI installed for this. 
 
```
# Build the client:
# (Note for Windows users: You might run into this issue with npm install:
# https://github.com/npm/npm/issues/17671. Retrying worked for me.)
cd client
npm install
npm run build

# Copy the client build to public server resources
cp -a build/. ../server/resources/public/

cd ../server/

# Deploy the server to Heroku using git. I'm creating a git repository
# inside the repository here to avoid committing the client build to the
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

# The app should be up and running. Open in the browser:
heroku open
```
