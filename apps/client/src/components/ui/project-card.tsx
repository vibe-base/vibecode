import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, CodeIcon, UsersIcon } from '@/components/ui/lucide-icons';

export interface Project {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  members: number;
  language: string;
}

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          <div className="flex items-center">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <span>Updated {project.lastUpdated}</span>
          </div>
          <div className="flex items-center">
            <UsersIcon className="mr-1 h-3 w-3" />
            <span>{project.members} members</span>
          </div>
          <div className="flex items-center">
            <CodeIcon className="mr-1 h-3 w-3" />
            <span>{project.language}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onSelect(project)}
        >
          Open Project
        </Button>
      </CardFooter>
    </Card>
  );
}
