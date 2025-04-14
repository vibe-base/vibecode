import React from 'react';
import { GitHubLoginButton } from '@/components/ui/github-login-button';
import { GoogleLoginButton } from '@/components/ui/google-login-button';

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
          <GoogleLoginButton className="w-full" />

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