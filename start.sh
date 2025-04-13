#!/bin/sh
# Start the Express server
echo "Starting Express server..."
node index.js &
# Keep the container running
echo "Container is now running..."
# Trap SIGTERM and SIGINT
trap "echo 'Caught signal, shutting down...'; kill \$(jobs -p); exit 0" SIGTERM SIGINT
# Keep the script running
while true; do
  sleep 10
done
