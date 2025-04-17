export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at?: string;
  language?: string;
  owner_id?: string;
  members?: string[];
  status?: 'active' | 'archived' | 'completed';
  tags?: string[];
}

export const mockProjects: Project[] = [
  {
    id: "proj-001",
    name: "VibeCode Editor",
    description: "A collaborative code editor with real-time collaboration features and AI assistance",
    created_at: "2023-10-15T14:22:00Z",
    updated_at: "2023-11-20T09:15:30Z",
    language: "TypeScript",
    owner_id: "user-123",
    members: ["user-123", "user-456", "user-789"],
    status: "active",
    tags: ["editor", "collaboration", "ai"]
  },
  {
    id: "proj-002",
    name: "Data Visualization Dashboard",
    description: "Interactive dashboard for visualizing complex datasets with customizable charts and filters",
    created_at: "2023-09-05T10:30:00Z",
    updated_at: "2023-11-18T16:45:20Z",
    language: "JavaScript",
    owner_id: "user-456",
    members: ["user-456", "user-789"],
    status: "active",
    tags: ["dashboard", "data", "visualization"]
  },
  {
    id: "proj-003",
    name: "Mobile App Backend",
    description: "RESTful API backend for a cross-platform mobile application with authentication and data storage",
    created_at: "2023-08-20T08:15:00Z",
    updated_at: "2023-11-10T11:20:15Z",
    language: "Python",
    owner_id: "user-123",
    members: ["user-123", "user-789"],
    status: "active",
    tags: ["backend", "api", "mobile"]
  },
  {
    id: "proj-004",
    name: "E-commerce Platform",
    description: "Full-stack e-commerce solution with product management, cart functionality, and payment processing",
    created_at: "2023-07-12T13:45:00Z",
    updated_at: "2023-10-30T14:10:45Z",
    language: "JavaScript",
    owner_id: "user-789",
    members: ["user-789", "user-456"],
    status: "completed",
    tags: ["e-commerce", "fullstack", "payments"]
  },
  {
    id: "proj-005",
    name: "Machine Learning Model",
    description: "Predictive analytics model for customer behavior analysis using machine learning algorithms",
    created_at: "2023-06-25T09:30:00Z",
    updated_at: "2023-09-15T10:25:30Z",
    language: "Python",
    owner_id: "user-456",
    members: ["user-456", "user-123"],
    status: "archived",
    tags: ["ml", "analytics", "data-science"]
  }
];
