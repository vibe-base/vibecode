# VibeCode Helm Chart

This Helm chart deploys the VibeCode application stack, including:

- Frontend (React)
- Express API
- FastAPI
- Caddy (reverse proxy)
- Longhorn (distributed storage)

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- kubectl installed and configured
- A Kubernetes cluster with LoadBalancer support

## Installing the Chart

First, update the dependencies:

```bash
helm dependency update ./helm/vibecode
```

To install the chart with the release name `vibecode`:

```bash
helm install vibecode ./helm/vibecode
```

## Configuration

1. Copy the example values files:
```bash
cp values.yaml.example values.yaml
cp values-production.yaml.example values-production.yaml
```

2. Update the values files with your specific configuration
3. Never commit the actual values files to version control

The following table lists the configurable parameters of the VibeCode chart and their default values.

### Common Settings

| Parameter | Description | Default |
|-----------|-------------|---------|
| `nameOverride` | Override the name of the chart | `""` |
| `fullnameOverride` | Override the full name of the chart | `""` |
| `imagePullSecrets` | Image pull secrets | `[{name: regcred}]` |

### Caddy Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `caddy.image` | Caddy image | `docker.io/library/caddy:latest` |
| `caddy.pullPolicy` | Image pull policy | `IfNotPresent` |
| `caddy.ports` | Ports to expose | `[80, 443]` |
| `caddy.resources` | Resource limits and requests | See `values.yaml` |
| `caddy.email` | Email for Let's Encrypt | `your-email@example.com` |
| `caddy.persistence.enabled` | Enable persistence | `true` |
| `caddy.persistence.size` | Size of the PVC | `1Gi` |

### Longhorn Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `longhorn.enabled` | Enable Longhorn | `true` |
| `longhorn.storageClass.name` | Name of the StorageClass | `longhorn` |
| `longhorn.storageClass.isDefault` | Set as default StorageClass | `true` |
| `longhorn.storageClass.reclaimPolicy` | Reclaim policy | `Delete` |
| `longhorn.storageClass.volumeBindingMode` | Volume binding mode | `Immediate` |
| `longhorn.storageClass.allowVolumeExpansion` | Allow volume expansion | `true` |
| `longhorn.storageClass.parameters.numberOfReplicas` | Number of replicas | `3` |
| `longhorn.storageClass.parameters.staleReplicaTimeout` | Stale replica timeout | `30` |
| `longhorn.storageClass.parameters.fsType` | Filesystem type | `ext4` |

## Using Longhorn for Persistent Storage

This chart includes Longhorn for distributed storage. Longhorn provides replicated block storage for Kubernetes workloads.

### Benefits of Longhorn

- High availability with data replication
- Snapshots and backups
- Volume expansion
- Disaster recovery

### Accessing the Longhorn UI

After installing the chart, you can access the Longhorn UI:

```bash
kubectl port-forward -n longhorn-system svc/longhorn-frontend 8000:80
```

Then open your browser at http://localhost:8000

## Troubleshooting

If you encounter issues with persistent volumes:

1. Check if Longhorn is running:
   ```bash
   kubectl get pods -n longhorn-system
   ```

2. Check the status of your PVCs:
   ```bash
   kubectl get pvc
   ```

3. Check Longhorn volumes:
   ```bash
   kubectl get lhv -n longhorn-system
   ```
