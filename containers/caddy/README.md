# VibeCode Caddy Container

This directory contains the Caddy configuration for the VibeCode application. Caddy serves as a reverse proxy for the frontend, Express, and FastAPI services.

## Configuration

The `Caddyfile` contains the following routing rules:

- `/` - Routes to the frontend service (port 3000)
- `/api/express/*` - Routes to the Express service (port 5000)
- `/api/*` - Routes to the FastAPI service (port 8000)
- `/health` - Returns a 200 OK response for health checks

## Building the Docker Image

To build the Caddy Docker image:

```bash
docker build -t gigahard/vibecode-caddy:latest .
```

## Testing Locally

A docker-compose.yml file is provided for testing the Caddy configuration locally:

```bash
docker-compose up
```

This will start Caddy along with mock services for the frontend, Express, and FastAPI.

## Using in Production

For production use, update the Caddyfile to use real TLS certificates by removing the `internal` directive from the `tls` configuration.

## Volumes

Caddy uses two volumes:

- `/data` - For storing certificates and other data
- `/config` - For storing configuration

## Ports

Caddy exposes the following ports:

- `80` - HTTP
- `443` - HTTPS
