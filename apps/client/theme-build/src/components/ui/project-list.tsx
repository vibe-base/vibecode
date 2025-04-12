import React, { useState } from 'react';
import { ProjectCard, Project } from '@/components/ui/project-card';
import { Button } from '@/components/ui/button';
import { PlusIcon, SearchIcon } from '@/components/ui/lucide-icons';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onAddProject: (project: Omit<Project, 'id'>) => void;
}

export function ProjectList({ projects, onSelectProject, onAddProject }: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    language: 'JavaScript',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProject = () => {
    onAddProject({
      ...newProject,
      lastUpdated: 'just now',
      members: 1,
    });
    setNewProject({
      name: '',
      description: '',
      language: 'JavaScript',
    });
    setIsDialogOpen(false);
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project name</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="My Awesome Project"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="A brief description of your project"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language">Primary Language</Label>
                <select
                  id="language"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newProject.language}
                  onChange={(e) => setNewProject({ ...newProject, language: e.target.value })}
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="Go">Go</option>
                  <option value="Rust">Rust</option>
                  <option value="C#">C#</option>
                  <option value="C++">C++</option>
                  <option value="PHP">PHP</option>
                  <option value="Ruby">Ruby</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProject} disabled={!newProject.name}>Create Project</Button>
            </DialogFooter>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
