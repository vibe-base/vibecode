# VibeCode Deployment Guide

This guide explains how to deploy VibeCode to a Kubernetes cluster using Helm.

## Prerequisites

- Kubernetes cluster (k3s, k8s, etc.)
- Helm 3.x installed
- kubectl configured to access your cluster
- A domain name pointing to your cluster's IP address

## Deployment Steps

1. **IMPORTANT**: Install cert-manager first:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml
```

2. Wait for cert-manager to be ready:

```bash
kubectl -n cert-manager wait --for=condition=ready pod --all --timeout=300s
```

3. Verify cert-manager is running:

```bash
kubectl get pods -n cert-manager
```

You should see pods like `cert-manager-xxx`, `cert-manager-cainjector-xxx`, and `cert-manager-webhook-xxx` all in the Running state.

4. Install Longhorn for persistent storage (if not already installed):

```bash
kubectl apply -f https://raw.githubusercontent.com/longhorn/longhorn/v1.5.1/deploy/longhorn.yaml
```

5. Wait for Longhorn to be ready:

```bash
kubectl -n longhorn-system wait --for=condition=ready pod --all --timeout=300s
```

6. Update the values-production.yaml file with your specific settings:
   - Update the email address for Let's Encrypt notifications
   - Update your domain name
   - Add your GitHub OAuth credentials

7. Deploy VibeCode using Helm:

```bash
# From the helm directory
helm upgrade --install vibecode ./vibecode -f values-production.yaml
```

8. Check the status of your deployment:

```bash
kubectl get pods
kubectl get svc
kubectl get ingress
```

9. Check the status of your certificate:

```bash
kubectl get certificate
kubectl get certificaterequest
kubectl get order
kubectl get challenge
```

## Troubleshooting

### Certificate Issues

If you're having certificate issues:

1. Make sure cert-manager is properly installed:

```bash
kubectl get pods -n cert-manager
```

2. Check if the CRDs are installed:

```bash
kubectl get crd | grep cert-manager
```

You should see several CRDs including `certificates.cert-manager.io` and `clusterissuers.cert-manager.io`.

3. Check the cert-manager logs:

```bash
kubectl logs -n cert-manager -l app=cert-manager
```

4. Check the Traefik logs:

```bash
kubectl logs -n kube-system -l app.kubernetes.io/name=traefik
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
