import React from 'react';

// Custom CodeIcon since it's not available in Lucide React
export function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
}

// Re-export common icons from Lucide
export { 
  Search as SearchIcon, 
  Plus as PlusIcon,
  Calendar as CalendarIcon,
  Users as UsersIcon
} from 'lucide-react';
