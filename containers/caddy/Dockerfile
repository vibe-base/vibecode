FROM caddy:2.7-alpine

# Copy the Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Expose ports
EXPOSE 80 443

# Set up volumes for Caddy data
VOLUME /data
VOLUME /config

# Run Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
