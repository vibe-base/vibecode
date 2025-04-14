
#!/bin/sh

# Replace environment variables in the JavaScript files
JS_FILES=$(find /usr/share/nginx/html -type f -name "*.js")

for file in $JS_FILES; do
  # Replace VITE_* environment variables
  for var in $(env | grep '^VITE_'); do
    key=$(echo "$var" | cut -d'=' -f1)
    value=$(echo "$var" | cut -d'=' -f2-)
    sed -i "s|__${key}__|${value}|g" "$file"
  done
done

# Start nginx
exec "$@"

