# VibeCode Helm Chart

This Helm chart deploys the VibeCode platform, a collaborative coding platform with AI assistance.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- Longhorn storage provisioner (optional)
- PostgreSQL (optional, can be deployed as a dependency)

## Installation

1. Add the Helm repository:
```bash
helm repo add vibecode https://vibecode.github.io/charts
```

2. Create a values file with your configuration:
```yaml
# my-values.yaml
fastapi:
  githubClientId: "your-github-client-id"
  githubClientSecret: "your-github-client-secret"
  secretKey: "your-secret-key"

postgresql:
  enabled: true
  auth:
    username: vibecode
    password: "your-postgres-password"
    database: vibecode
```

3. Install the chart:
```bash
helm install vibecode vibecode/vibecode -f my-values.yaml
```

## Configuration

The following table lists the configurable parameters of the VibeCode chart and their default values.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `fastapi.image.repository` | FastAPI image repository | `vibecode/fastapi` |
| `fastapi.image.tag` | FastAPI image tag | `latest` |
| `fastapi.githubClientId` | GitHub OAuth client ID | `""` |
| `fastapi.githubClientSecret` | GitHub OAuth client secret | `""` |
| `fastapi.secretKey` | Secret key for JWT tokens | `""` |
| `postgresql.enabled` | Enable PostgreSQL deployment | `true` |
| `postgresql.auth.username` | PostgreSQL username | `vibecode` |
| `postgresql.auth.password` | PostgreSQL password | `""` |
| `postgresql.auth.database` | PostgreSQL database name | `vibecode` |

## Upgrading

To upgrade your deployment:

```bash
helm upgrade vibecode vibecode/vibecode -f my-values.yaml
```

## Uninstalling

To uninstall the chart:

```bash
helm uninstall vibecode
```

## License

This chart is licensed under the MIT License.
