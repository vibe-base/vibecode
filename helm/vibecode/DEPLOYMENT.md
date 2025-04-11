# VibeCode Deployment Guide

This guide explains how to deploy VibeCode to a Kubernetes cluster using Helm.

## Prerequisites

- Kubernetes cluster (k3s, k8s, etc.)
- Helm 3.x installed
- kubectl configured to access your cluster
- A domain name pointing to your cluster's IP address

## Deployment Steps

1. Install Longhorn for persistent storage (if not already installed):

```bash
kubectl apply -f https://raw.githubusercontent.com/longhorn/longhorn/v1.5.1/deploy/longhorn.yaml
```

2. Wait for Longhorn to be ready:

```bash
kubectl -n longhorn-system wait --for=condition=ready pod --all --timeout=300s
```

3. Update the values-production.yaml file with your specific settings:
   - Update the email address for Let's Encrypt notifications
   - Update your domain name
   - Add your GitHub OAuth credentials

4. Deploy VibeCode using Helm:

```bash
# From the helm directory
helm upgrade --install vibecode ./vibecode -f values-production.yaml
```

5. Check the status of your deployment:

```bash
kubectl get pods
kubectl get svc
```

6. Wait for the LoadBalancer service to get an external IP:

```bash
kubectl get svc caddy
```

7. Once the external IP is assigned, update your DNS to point to this IP.

## Troubleshooting

### Certificate Issues

If you're having certificate issues:

1. Make sure your domain is correctly pointing to the external IP of the LoadBalancer service
2. Check the Caddy logs:

```bash
kubectl logs -l app=caddy
```

3. If needed, you can temporarily use self-signed certificates by setting:

```yaml
caddy:
  tls:
    selfSigned: true
```

### Persistent Volume Issues

If you're having issues with persistent volumes:

1. Check the status of Longhorn:

```bash
kubectl -n longhorn-system get pods
```

2. Check the status of your PVCs:

```bash
kubectl get pvc
```

## Accessing the Application

Once deployed, you can access the application at:

- Frontend: https://your-domain.com
- API: https://your-domain.com/api
- Express API: https://your-domain.com/api/express

## Updating the Deployment

To update your deployment:

1. Update the values-production.yaml file with any changes
2. Run the Helm upgrade command:

```bash
helm upgrade vibecode ./vibecode -f values-production.yaml
```
