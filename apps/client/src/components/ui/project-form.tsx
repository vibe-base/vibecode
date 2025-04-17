import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface ProjectFormProps {
  project: {
    name: string;
    description: string;
    language: string;
  };
  onSubmit: () => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Project name</Label>
          <Input
            id="name"
            value={project.name}
            onChange={(e) => project.name = e.target.value}
            placeholder="My Awesome Project"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={project.description}
            onChange={(e) => project.description = e.target.value}
            placeholder="A brief description of your project"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="language">Primary Language</Label>
          <select
            id="language"
            value={project.language}
            onChange={(e) => project.language = e.target.value}
            className="form-select"
          >
            <option value="JavaScript">JavaScript</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="Go">Go</option>
            <option value="Rust">Rust</option>
            <option value="PHP">PHP</option>
            <option value="Ruby">Ruby</option>
          </select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!project.name}>
          {project.id ? 'Update' : 'Create'} Project
        </Button>
      </DialogFooter>
    </form>
  );
}