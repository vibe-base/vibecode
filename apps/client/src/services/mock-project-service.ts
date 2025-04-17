import { Project, mockProjects } from '../data/mock-projects';
import { isDevModeEnabled } from '../lib/dev-mode';
import { FastAPIProjectService } from './fastapi-project-service';

// In-memory storage for projects in development mode
let projectsStore = [...mockProjects];

// Generate a unique ID for new projects
const generateId = (): string => {
  return `proj-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Format date to ISO string
const formatDate = (): string => {
  return new Date().toISOString();
};

export interface CreateProjectInput {
  name: string;
  description: string;
  language?: string;
  tags?: string[];
}

export interface ProjectService {
  getProjects: () => Promise<Project[]>;
  getProject: (id: string) => Promise<Project | null>;
  createProject: (input: CreateProjectInput) => Promise<Project>;
  updateProject: (id: string, input: Partial<Project>) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
}

/**
 * Mock implementation of the project service for development
 */
class MockProjectService implements ProjectService {
  /**
   * Get all projects
   */
  async getProjects(): Promise<Project[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...projectsStore];
  }

  /**
   * Get a project by ID
   */
  async getProject(id: string): Promise<Project | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const project = projectsStore.find(p => p.id === id);
    return project || null;
  }

  /**
   * Create a new project
   */
  async createProject(input: CreateProjectInput): Promise<Project> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create new project
    const newProject: Project = {
      id: generateId(),
      name: input.name,
      description: input.description,
      created_at: formatDate(),
      updated_at: formatDate(),
      language: input.language || 'JavaScript',
      status: 'active',
      tags: input.tags || [],
      members: ['user-123'], // Current user
    };
    
    // Add to store
    projectsStore = [newProject, ...projectsStore];
    
    return newProject;
  }

  /**
   * Update an existing project
   */
  async updateProject(id: string, input: Partial<Project>): Promise<Project | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Find project
    const index = projectsStore.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    // Update project
    const updatedProject = {
      ...projectsStore[index],
      ...input,
      updated_at: formatDate(),
    };
    
    // Update store
    projectsStore = [
      ...projectsStore.slice(0, index),
      updatedProject,
      ...projectsStore.slice(index + 1)
    ];
    
    return updatedProject;
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find project
    const index = projectsStore.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    // Remove from store
    projectsStore = [
      ...projectsStore.slice(0, index),
      ...projectsStore.slice(index + 1)
    ];
    
    return true;
  }
}

/**
 * Real implementation that calls the API
 */
class ApiProjectService implements ProjectService {
  async getProjects(): Promise<Project[]> {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  }

  async getProject(id: string): Promise<Project | null> {
    const response = await fetch(`/api/projects/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  }

  async updateProject(id: string, input: Partial<Project>): Promise<Project | null> {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  }

  async deleteProject(id: string): Promise<boolean> {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok && response.status !== 404) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.ok;
  }
}

// Export the appropriate service based on development mode
export const projectService: ProjectService = isDevModeEnabled() 
  ? new MockProjectService() 
  : new FastAPIProjectService();
