import { Project, CreateProjectInput } from '../data/mock-projects';

export class FastAPIProjectService {
  private baseUrl = '/api';

  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${this.baseUrl}/projects`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  }

  async getProject(id: string): Promise<Project | null> {
    const response = await fetch(`${this.baseUrl}/projects/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    const response = await fetch(`${this.baseUrl}/projects`, {
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
    const response = await fetch(`${this.baseUrl}/projects/${id}`, {
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
    const response = await fetch(`${this.baseUrl}/projects/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok && response.status !== 404) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.ok;
  }
} 