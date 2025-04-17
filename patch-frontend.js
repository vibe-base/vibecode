const fs = require('fs');
const path = require('path');

// Mock projects data
const MOCK_PROJECTS = [
  {
    id: 'mock-project-1',
    name: 'Mock Project 1',
    description: 'This is a mock project for development',
    language: 'Python',
    owner_id: 'mock-user-id',
    members: ['mock-user-id'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-project-2',
    name: 'Mock Project 2',
    description: 'Another mock project for development',
    language: 'JavaScript',
    owner_id: 'mock-user-id',
    members: ['mock-user-id'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Function to patch the frontend code
async function patchFrontend() {
  try {
    console.log('Creating frontend patch...');
    
    // Create a JavaScript file that will be injected into the frontend
    const patchCode = `
// Mock projects data
const MOCK_PROJECTS = ${JSON.stringify(MOCK_PROJECTS, null, 2)};

// Override the fetch function to intercept API calls
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  // Check if this is a request to the projects API
  if (url.includes('/api/projects')) {
    console.log('Intercepting request to', url);
    
    // Return mock data instead of making the actual request
    return new Promise((resolve) => {
      resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(MOCK_PROJECTS)
      });
    });
  }
  
  // For all other requests, use the original fetch
  return originalFetch(url, options);
};

// Also override axios if it's being used
if (window.axios) {
  const originalAxiosGet = window.axios.get;
  window.axios.get = function(url, options) {
    // Check if this is a request to the projects API
    if (url.includes('/api/projects')) {
      console.log('Intercepting axios request to', url);
      
      // Return mock data instead of making the actual request
      return Promise.resolve({
        status: 200,
        data: MOCK_PROJECTS
      });
    }
    
    // For all other requests, use the original axios.get
    return originalAxiosGet(url, options);
  };
}

console.log('Frontend patch applied - Projects API calls will now return mock data');
`;
    
    // Write the patch file
    fs.writeFileSync('frontend-patch.js', patchCode);
    console.log('Frontend patch created: frontend-patch.js');
    
    // Create a ConfigMap for the patch
    const configMapYaml = `
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-patch
  namespace: vibecode
data:
  patch.js: |
${patchCode.split('\n').map(line => '    ' + line).join('\n')}
`;
    
    fs.writeFileSync('frontend-patch-configmap.yaml', configMapYaml);
    console.log('ConfigMap created: frontend-patch-configmap.yaml');
    
    // Create a script to inject the patch into the frontend
    const injectScript = `#!/bin/sh

# Apply the ConfigMap
kubectl apply -f frontend-patch-configmap.yaml

# Create a temporary directory for the frontend patch
mkdir -p frontend-patch-temp

# Create an index.html file that includes the patch script
cat > ./frontend-patch-temp/index.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VibeCode</title>
  <script src="/patch.js"></script>
  <script>
    // Redirect to the actual index.html after loading the patch
    window.location.href = "/index-original.html";
  </script>
</head>
<body>
  <p>Loading VibeCode...</p>
</body>
</html>
EOF

# Create a Dockerfile for the patched frontend
cat > ./frontend-patch-temp/Dockerfile << EOF
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy the original frontend files
COPY --from=gigahard/vibecode-frontend:latest /usr/share/nginx/html /usr/share/nginx/html

# Rename the original index.html
RUN mv /usr/share/nginx/html/index.html /usr/share/nginx/html/index-original.html

# Copy the patched index.html
COPY index.html /usr/share/nginx/html/index.html

# Create a directory for the patch script
RUN mkdir -p /usr/share/nginx/html/patch

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

# Build the Docker image
cd frontend-patch-temp
docker build -t gigahard/vibecode-frontend-patched:latest --platform linux/amd64 .
docker push gigahard/vibecode-frontend-patched:latest

# Update the frontend deployment to use the patched image and mount the patch script
cat > ./frontend-patch-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: vibecode
spec:
  template:
    spec:
      containers:
      - name: frontend
        image: gigahard/vibecode-frontend-patched:latest
        volumeMounts:
        - name: patch-script
          mountPath: /usr/share/nginx/html/patch.js
          subPath: patch.js
      volumes:
      - name: patch-script
        configMap:
          name: frontend-patch
EOF

# Apply the deployment patch
kubectl apply -f frontend-patch-deployment.yaml

# Restart the frontend deployment
kubectl rollout restart deployment/frontend -n vibecode

# Clean up
cd ..
rm -rf frontend-patch-temp
`;
    
    fs.writeFileSync('inject-frontend-patch.sh', injectScript);
    fs.chmodSync('inject-frontend-patch.sh', '755');
    console.log('Injection script created: inject-frontend-patch.sh');
    
    console.log('Frontend patch preparation complete. Run ./inject-frontend-patch.sh to apply the patch.');
  } catch (error) {
    console.error('Error creating frontend patch:', error);
  }
}

// Run the patch function
patchFrontend();
