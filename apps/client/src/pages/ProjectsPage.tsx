import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../data/mock-projects';
import { projectService, CreateProjectInput } from '../services/mock-project-service';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Modal } from '../components/ui/Modal';
import { useTheme } from '../lib/theme';
import { UserProfileDropdown } from '../components/ui/user-profile-dropdown';
import { useAuth } from '../lib/auth';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Theme-specific styles
  const getThemeStyles = () => {
    switch (mode) {
      case 'light':
        return {
          background: 'bg-gray-50',
          text: 'text-gray-800',
          secondaryText: 'text-gray-600',
          mutedText: 'text-gray-500',
          card: 'bg-white border-gray-200 shadow-sm hover:shadow',
          cardHover: 'hover:border-blue-400',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          secondaryButton: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
          tag: 'bg-blue-100 text-blue-800',
          statusActive: 'bg-green-100 text-green-800',
          statusCompleted: 'bg-blue-100 text-blue-800',
          statusArchived: 'bg-gray-100 text-gray-800',
          alert: {
            error: 'bg-red-50 border-red-400 text-red-700',
            success: 'bg-green-50 border-green-400 text-green-700',
            warning: 'bg-yellow-50 border-yellow-400 text-yellow-700'
          }
        };
      case 'dark':
        return {
          background: 'bg-gray-900',
          text: 'text-gray-100',
          secondaryText: 'text-gray-300',
          mutedText: 'text-gray-400',
          card: 'bg-gray-800 border-gray-700 shadow-md',
          cardHover: 'hover:border-blue-500',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          secondaryButton: 'bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600',
          tag: 'bg-blue-900 text-blue-300',
          statusActive: 'bg-green-900 text-green-300',
          statusCompleted: 'bg-blue-900 text-blue-300',
          statusArchived: 'bg-gray-700 text-gray-300',
          alert: {
            error: 'bg-red-900/30 border-red-700 text-red-400',
            success: 'bg-green-900/30 border-green-700 text-green-400',
            warning: 'bg-yellow-900/30 border-yellow-700 text-yellow-400'
          }
        };
      case 'terminal':
        return {
          background: 'bg-black',
          text: 'text-green-400 font-mono',
          secondaryText: 'text-green-500 font-mono',
          mutedText: 'text-green-600 font-mono',
          card: 'bg-black border-green-800 shadow-md shadow-green-900/20',
          cardHover: 'hover:border-green-500',
          button: 'bg-green-800 hover:bg-green-700 text-green-100 font-mono',
          secondaryButton: 'bg-black border border-green-700 text-green-400 hover:bg-green-900 font-mono',
          tag: 'bg-green-900 text-green-400 font-mono',
          statusActive: 'bg-green-900 text-green-400',
          statusCompleted: 'bg-blue-900 text-blue-400',
          statusArchived: 'bg-gray-900 text-gray-400',
          alert: {
            error: 'bg-red-900/20 border-red-800 text-red-500 font-mono',
            success: 'bg-green-900/20 border-green-800 text-green-500 font-mono',
            warning: 'bg-yellow-900/20 border-yellow-800 text-yellow-500 font-mono'
          }
        };
      default:
        return {
          background: 'bg-gray-50',
          text: 'text-gray-800',
          secondaryText: 'text-gray-600',
          mutedText: 'text-gray-500',
          card: 'bg-white border-gray-200 shadow-sm hover:shadow',
          cardHover: 'hover:border-blue-400',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          secondaryButton: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
          tag: 'bg-blue-100 text-blue-800',
          statusActive: 'bg-green-100 text-green-800',
          statusCompleted: 'bg-blue-100 text-blue-800',
          statusArchived: 'bg-gray-100 text-gray-800',
          alert: {
            error: 'bg-red-50 border-red-400 text-red-700',
            success: 'bg-green-50 border-green-400 text-green-700',
            warning: 'bg-yellow-50 border-yellow-400 text-yellow-700'
          }
        };
    }
  };

  const styles = getThemeStyles();

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Function to fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await projectService.getProjects();
      setProjects(data);
    } catch (e) {
      console.error('Error fetching projects:', e);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new project
  const handleCreateProject = async (projectData: CreateProjectInput) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Create the project
      const newProject = await projectService.createProject(projectData);

      // Add to projects list
      setProjects(prevProjects => [newProject, ...prevProjects]);

      // Show success message
      setSuccessMessage(`Project "${newProject.name}" created successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);

      // Close modal
      setIsCreateModalOpen(false);
    } catch (e) {
      console.error('Error creating project:', e);
      setError('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a project
  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation(); // Prevent navigating to the project
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);

      // Delete the project
      const success = await projectService.deleteProject(projectToDelete.id);

      if (success) {
        // Remove from projects list
        setProjects(prevProjects => prevProjects.filter(p => p.id !== projectToDelete.id));

        // Show success message
        setSuccessMessage(`Project "${projectToDelete.name}" deleted successfully!`);
        setTimeout(() => setSuccessMessage(null), 5000);

        // Close modal
        setIsDeleteModalOpen(false);
        setProjectToDelete(null);
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (e) {
      console.error('Error deleting project:', e);
      setError('Failed to delete project. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectProject = (projectId: string) => {
    console.log('Navigating to project:', projectId);
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className={`p-6 max-w-7xl mx-auto min-h-screen ${styles.background} ${styles.text}`}>
        {error && (
          <div className={`border-l-4 p-4 mb-6 ${styles.alert.warning}`} role="alert">
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className={`border-l-4 p-4 mb-6 ${styles.alert.success}`} role="alert">
            <p>{successMessage}</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${styles.text}`}>Your Projects</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className={`px-4 py-2 rounded-md transition-colors ${styles.button}`}
            >
              Create New Project
            </button>
            <UserProfileDropdown />
          </div>
        </div>

        {projects.length === 0 ? (
          <div className={`text-center py-12 rounded-lg border ${styles.card}`}>
            <h2 className={`text-xl font-semibold mb-2 ${styles.text}`}>No projects yet</h2>
            <p className={`mb-4 ${styles.mutedText}`}>Create your first project to get started</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className={`px-4 py-2 rounded-md transition-colors ${styles.button}`}
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`border rounded-lg p-6 transition-all ${styles.card} ${styles.cardHover} relative group`}
              >
                {/* Delete button - visible on hover */}
                <button
                  onClick={(e) => handleDeleteClick(e, project)}
                  className={`absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${mode === 'terminal' ? 'bg-red-900 text-red-400 hover:bg-red-800' : mode === 'dark' ? 'bg-red-900/30 text-red-400 hover:bg-red-800/40' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                  aria-label="Delete project"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                {/* Project content - clickable */}
                <div
                  className="cursor-pointer"
                  onClick={() => handleSelectProject(project.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-lg font-semibold ${styles.text}`}>{project.name}</h3>
                    {project.status && (
                      <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'active' ? styles.statusActive : project.status === 'completed' ? styles.statusCompleted : styles.statusArchived}`}>
                        {project.status}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mb-4 ${styles.secondaryText}`}>{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags?.map(tag => (
                      <span key={tag} className={`text-xs px-2 py-1 rounded-full ${styles.tag}`}>{tag}</span>
                    ))}
                  </div>
                  <div className={`flex justify-between text-xs border-t pt-4 ${styles.mutedText}`}>
                    <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                    {project.language && <span>Language: {project.language}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => !isSubmitting && setIsCreateModalOpen(false)}
        title="Create New Project"
        size="lg"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => !isSubmitting && setIsCreateModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Project Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        title="Delete Project"
        size="sm"
      >
        <div className={`p-4 ${styles.text}`}>
          <p className="mb-4">
            Are you sure you want to delete the project <strong>"{projectToDelete?.name}"</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className={`px-4 py-2 rounded-md ${styles.secondaryButton}`}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProject}
              className={`px-4 py-2 rounded-md ${mode === 'terminal' ? 'bg-red-900 text-red-100 hover:bg-red-800 font-mono' : mode === 'dark' ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-red-600 text-white hover:bg-red-700'} ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
