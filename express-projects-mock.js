const express = require('express');
const router = express.Router();

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

// Direct handler for /api/projects endpoint
router.get('/api/projects', (req, res) => {
  console.log('Direct handler for /api/projects called');
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  
  // Return mock projects data
  return res.json(MOCK_PROJECTS);
});

// Handler for creating a new project
router.post('/api/projects', (req, res) => {
  console.log('Creating new project:', req.body);
  
  // Create a new mock project
  const newProject = {
    id: `mock-project-${Date.now()}`,
    name: req.body.name || 'New Project',
    description: req.body.description || 'A new project',
    language: req.body.language || 'Unknown',
    owner_id: 'mock-user-id',
    members: ['mock-user-id'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Return the new project
  return res.status(201).json(newProject);
});

// Handler for getting a specific project
router.get('/api/projects/:id', (req, res) => {
  console.log('Getting project:', req.params.id);
  
  // Find the project in the mock data
  const project = MOCK_PROJECTS.find(p => p.id === req.params.id);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  // Return the project
  return res.json(project);
});

// Handler for updating a project
router.put('/api/projects/:id', (req, res) => {
  console.log('Updating project:', req.params.id);
  
  // Find the project in the mock data
  const project = MOCK_PROJECTS.find(p => p.id === req.params.id);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  // Update the project
  const updatedProject = {
    ...project,
    name: req.body.name || project.name,
    description: req.body.description || project.description,
    language: req.body.language || project.language,
    updated_at: new Date().toISOString()
  };
  
  // Return the updated project
  return res.json(updatedProject);
});

// Handler for deleting a project
router.delete('/api/projects/:id', (req, res) => {
  console.log('Deleting project:', req.params.id);
  
  // Find the project in the mock data
  const project = MOCK_PROJECTS.find(p => p.id === req.params.id);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  // Return success
  return res.status(204).send();
});

module.exports = router;
