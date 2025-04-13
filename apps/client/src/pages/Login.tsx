import React from 'react';
import { GitHubLoginButton } from '@/components/ui/github-login-button';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome to VibeCode</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to start coding with AI assistance
          </p>
        </div>

        <div className="space-y-4">
          <GitHubLoginButton className="w-full" />
          
          {/* Placeholder buttons for future auth methods */}
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white opacity-50 cursor-not-allowed"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm.14 19.018c-3.868 0-7-3.14-7-7.018c0-3.878 3.132-7.018 7-7.018c1.89 0 3.47.697 4.682 1.829l-1.974 1.978c-.532-.511-1.466-1.108-2.708-1.108c-2.31 0-4.187 1.914-4.187 4.319c0 2.405 1.877 4.319 4.187 4.319c2.693 0 3.703-1.931 3.86-2.931H12v-2.591h6.79c.066.343.109.686.109 1.036c0 4.152-2.786 7.085-6.759 7.085z"/>
            </svg>
            Google (Coming Soon)
          </button>

          <button
            disabled
            className="w-full flex items-center justify-center gap-2 rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white opacity-50 cursor-not-allowed"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 3a5 5 0 0 0-5 5v1h2v-1a3 3 0 1 1 6 0v1h2v-1a5 5 0 0 0-5-5z"/>
            </svg>
            Email (Coming Soon)
          </button>
        </div>

        <p className="text-sm text-center text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}