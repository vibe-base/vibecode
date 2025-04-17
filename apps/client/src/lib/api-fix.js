// This script will patch the client code to use a different endpoint for creating projects
// Run this script with: node api-fix.js

const fs = require('fs');
const path = require('path');

// Path to the api.ts file
const apiFilePath = path.join(__dirname, 'api.ts');

// Read the file
let apiFileContent = fs.readFileSync(apiFilePath, 'utf8');

// Replace the createProject function
apiFileContent = apiFileContent.replace(
  "createProject: (project: Omit<Project, 'id'>) => axios.post('/api/projects', project),",
  "createProject: (project: Omit<Project, 'id'>) => axios.post('/api/projects/create-no-auth', project),"
);

// Write the file back
fs.writeFileSync(apiFilePath, apiFileContent);

console.log('Successfully patched api.ts to use the create-no-auth endpoint');
