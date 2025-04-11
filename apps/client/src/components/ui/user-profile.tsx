import React from 'react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface UserProfileProps {
  className?: string;
}

export function UserProfile({ className }: UserProfileProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium">{user.fullName || user.username}</span>
        <span className="text-xs text-muted-foreground">{user.email}</span>
      </div>
      
      <div className="relative">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <button
        onClick={logout}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Sign out
      </button>
    </div>
  );
}
