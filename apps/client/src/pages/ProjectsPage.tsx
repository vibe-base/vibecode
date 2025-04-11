import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectList } from '@/components/ui/project-list';
import { Project } from '@/components/ui/project-card';
import { useAuth } from '@/lib/auth';

// Sample projects data
const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'VibeCode',
    description: 'A collaborative coding platform with AI assistance',
    lastUpdated: '2 days ago',
    members: 5,
    language: 'TypeScript',
  },
  {
    id: '2',
    name: 'Data Analyzer',
    description: 'Tool for analyzing and visualizing large datasets',
    lastUpdated: '1 week ago',
    members: 3,
    language: 'Python',
  },
  {
    id: '3',
    name: 'Mobile App',
    description: 'Cross-platform mobile application for task management',
    lastUpdated: '3 days ago',
    members: 4,
    language: 'React Native',
  },
];

export default function ProjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(sampleProjects);

  const handleSelectProject = (project: Project) => {
    console.log('Selected project:', project);
    // In a real app, you would navigate to the project page
    // navigate(`/projects/${project.id}`);
    alert(`Opening project: ${project.name}`);
  };

  const handleAddProject = (newProject: Omit<Project, 'id'>) => {
    const project: Project = {
      ...newProject,
      id: `project-${Date.now()}`, // Generate a unique ID
    };
    setProjects([...projects, project]);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.username || 'User'}!</h1>
        <p className="text-muted-foreground">Manage your coding projects</p>
      </div>

      <ProjectList
        projects={projects}
        onSelectProject={handleSelectProject}
        onAddProject={handleAddProject}
      />
    </div>
  );
}
