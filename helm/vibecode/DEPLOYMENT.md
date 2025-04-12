# VibeCode Deployment Guide

This guide explains how to deploy VibeCode to a Kubernetes cluster using Helm.

## Prerequisites

- Kubernetes cluster (k3s, k8s, etc.)
- Helm 3.x installed
- kubectl configured to access your cluster
- A domain name pointing to your cluster's IP address
- Traefik configured with Let's Encrypt

## Traefik Configuration

Before deploying VibeCode, make sure Traefik is configured with Let's Encrypt:

```bash
# Create traefik-values.yaml
cat > traefik-values.yaml << 'EOT'
deployment:
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
  initContainers:
    - name: fix-acme-perms
      image: busybox:1.35
      command:
        - sh
        - -c
        - |
          touch /data/acme.json
          chmod 600 /data/acme.json
      securityContext:
        runAsUser: 0
      volumeMounts:
        - name: traefik  # must match the actual PVC name
          mountPath: /data

persistence:
  enabled: true
  name: traefik  # same here
  storageClass: longhorn
  accessMode: ReadWriteOnce
  size: 1Gi

ports:
  web:
    expose:
      default: true
    port: 80
  websecure:
    expose:
      default: true
    port: 443

additionalArguments:
  - "--entrypoints.web.address=:80"
  - "--entrypoints.websecure.address=:443"
  - "--certificatesresolvers.letsencrypt.acme.email=your@email.com"
  - "--certificatesresolvers.letsencrypt.acme.storage=/data/acme.json"
  - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
  - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
  - "--providers.kubernetesingress"
  - "--providers.kubernetescrd"
EOT

# Update the email address
sed -i 's/your@email.com/your-actual-email@example.com/' traefik-values.yaml

# Update Traefik
helm repo add traefik https://traefik.github.io/charts
helm repo update
helm upgrade --install traefik traefik/traefik \
  --namespace kube-system \
  -f traefik-values.yaml
```

Replace `your-actual-email@example.com` with your actual email address.

## Deployment Steps

1. Update the values-production.yaml file with your specific settings:
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

4. Check if Traefik is properly configured with Let's Encrypt:

```bash
kubectl exec -it -n kube-system $(kubectl get pods -n kube-system -l app.kubernetes.io/name=traefik -o name) -- cat /data/acme.json
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
