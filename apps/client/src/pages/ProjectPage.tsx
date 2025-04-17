import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { VSCodeLayout } from '../components/vscode/layout';
import { projectService } from '../services/mock-project-service';
import { Project } from '../data/mock-projects';
import { CodeFile } from '../components/vscode/code-file';
import { sampleFiles } from '../data/sample-code';

export default function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    if (!projectId) {
      setError('Project ID is missing');
      setLoading(false);
      return;
    }

    try {
      const projectData = await projectService.getProject(projectId);
      setProject(projectData);
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Project not found'}</p>
          <a href="/projects" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Back to Projects
          </a>
        </div>
      </div>
    );
  }

  // Use the VSCodeLayout to display the project
  return (
    <VSCodeLayout>
      {/* The Editor component in VSCodeLayout will automatically display the code files */}
    </VSCodeLayout>
  );
}