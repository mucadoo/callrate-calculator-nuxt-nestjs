#!/bin/sh
# Run dependency watcher in background
nodemon -w package.json -x "npm install" &

# Run the dev server
npm run dev
