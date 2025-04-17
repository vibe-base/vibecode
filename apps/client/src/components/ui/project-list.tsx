import React, { useState } from 'react';
import { ProjectCard, Project } from '@/components/ui/project-card';
import { Button } from '@/components/ui/button';
import { PlusIcon, SearchIcon } from '@/components/ui/lucide-icons';
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toast';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onUpdateProject: (id: string, project: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
}

export function ProjectList({ 
  projects, 
  onSelectProject, 
  onAddProject,
  onUpdateProject,
  onDeleteProject 
}: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    language: 'JavaScript',
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProject = async () => {
    try {
      await onAddProject({
        ...newProject,
        lastUpdated: 'just now',
        members: 1,
      });
      setNewProject({
        name: '',
        description: '',
        language: 'JavaScript',
      });
      setIsAddDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
    }
  };

  const handleEditProject = async (project: Project) => {
    try {
      await onUpdateProject(project.id, {
        name: editingProject?.name,
        description: editingProject?.description,
        language: editingProject?.language,
      });
      setEditingProject(null);
      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update project',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await onDeleteProject(id);
        toast({
          title: 'Success',
          description: 'Project deleted successfully',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete project',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new project</DialogTitle>
              <DialogDescription>
                Add the details for your new project.
              </DialogDescription>
            </DialogHeader>
            <ProjectForm
              project={newProject}
              onSubmit={handleAddProject}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found. Create a new one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
              onEdit={() => setEditingProject(project)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </div>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
            <DialogDescription>
              Update your project details.
            </DialogDescription>
          </DialogHeader>
          {editingProject && (
            <ProjectForm
              project={editingProject}
              onSubmit={() => handleEditProject(editingProject)}
              onCancel={() => setEditingProject(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
