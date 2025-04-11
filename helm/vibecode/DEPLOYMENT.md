# VibeCode Deployment Guide

This guide explains how to deploy VibeCode to a Kubernetes cluster using Helm.

## Prerequisites

- Kubernetes cluster (k3s, k8s, etc.)
- Helm 3.x installed
- kubectl configured to access your cluster
- A domain name pointing to your cluster's IP address
- Longhorn already installed in the cluster

## Deployment Steps

1. Update the values-production.yaml file with your specific settings:
   - Update the email address for Let's Encrypt notifications
   - Update your domain name
   - Add your GitHub OAuth credentials

2. Deploy VibeCode using Helm:

```bash
# From the helm directory
helm install vibecode ./vibecode -n vibecode --create-namespace -f values-production.yaml
```

3. Check the status of your deployment:

```bash
kubectl get pods -n vibecode
kubectl get svc -n vibecode
kubectl get ingress -n vibecode
```

4. Access the Longhorn UI:

```bash
kubectl port-forward -n longhorn-system svc/longhorn-frontend 8000:80
```

Then access http://localhost:8000 in your browser.

## Troubleshooting

### Certificate Issues

If you're having certificate issues:

1. Make sure your domain is correctly pointing to the external IP of your cluster
2. Check the Traefik logs:

```bash
kubectl logs -n kube-system -l app.kubernetes.io/name=traefik
```

3. Check if the Ingress was created:

```bash
kubectl get ingress -n vibecode
kubectl describe ingress vibecode-ingress -n vibecode
```

### Persistent Volume Issues

If you're having issues with persistent volumes:

1. Check the status of Longhorn:

```bash
kubectl get pods -n longhorn-system
```

2. Check the status of your PVCs:

```bash
kubectl get pvc -n vibecode
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
helm upgrade vibecode ./vibecode -n vibecode -f values-production.yaml
```
