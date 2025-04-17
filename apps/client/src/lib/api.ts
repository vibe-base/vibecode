import axios from './axios';
import { Project } from '../components/ui/project-card';

export const projectsApi = {
  getProjects: () => axios.get('/api/projects/test'),
  getProject: (id: string) => axios.get(`/api/projects/${id}`),
  createProject: (project: Omit<Project, 'id'>) => {
    // Just return a mock project for now
    return Promise.resolve({
      data: {
        id: `project-${Date.now()}`,
        name: project.name,
        description: project.description || '',
        language: project.language,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });
  },
  updateProject: (id: string, project: Partial<Project>) => axios.put(`/api/projects/${id}`, project),
  deleteProject: (id: string) => axios.delete(`/api/projects/${id}`),
};
