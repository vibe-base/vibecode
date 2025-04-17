#!/bin/sh

# Build the Docker image
docker build -t gigahard/vibecode-express-proxy:latest --platform linux/amd64 -f express-proxy-dockerfile .
docker push gigahard/vibecode-express-proxy:latest

# Create a Kubernetes deployment
cat > express-proxy-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: express
  namespace: vibecode
  labels:
    app: express
spec:
  replicas: 1
  selector:
    matchLabels:
      app: express
  template:
    metadata:
      labels:
        app: express
    spec:
      containers:
      - name: express
        image: gigahard/vibecode-express-proxy:latest
        imagePullPolicy: Always
        env:
        - name: FASTAPI_URL
          value: http://fastapi:8000
        - name: NODE_ENV
          value: development
        - name: PORT
          value: "5000"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              key: JWT_SECRET
              name: vibecode-new-github-oauth
        - name: GITHUB_CLIENT_ID
          valueFrom:
            secretKeyRef:
              key: GITHUB_CLIENT_ID
              name: vibecode-new-github-oauth
        - name: GITHUB_CLIENT_SECRET
          valueFrom:
            secretKeyRef:
              key: GITHUB_CLIENT_SECRET
              name: vibecode-new-github-oauth
        - name: GITHUB_REDIRECT_URI
          value: https://vibecode.gigahard.ai/github-callback
        - name: GOOGLE_CLIENT_ID
          valueFrom:
            secretKeyRef:
              key: GOOGLE_CLIENT_ID
              name: vibecode-new-google-oauth
        - name: GOOGLE_CLIENT_SECRET
          valueFrom:
            secretKeyRef:
              key: GOOGLE_CLIENT_SECRET
              name: vibecode-new-google-oauth
        - name: GOOGLE_REDIRECT_URI
          value: https://0192.ai/accounts/google/login/callback/
        ports:
        - containerPort: 5000
          protocol: TCP
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 15
          periodSeconds: 20
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 10
        resources:
          limits:
            cpu: 200m
            memory: 256Mi
          requests:
            cpu: 100m
            memory: 128Mi
EOF

# Apply the deployment
kubectl apply -f express-proxy-deployment.yaml
