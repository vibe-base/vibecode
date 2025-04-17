import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitHubLoginButton } from '@/components/ui/github-login-button';
import { GoogleLoginButton } from '@/components/ui/google-login-button';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Left side - Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.5,
                fontSize: `${Math.random() * 1 + 0.5}rem`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {['0', '1', '<>', '{}', '()', '[]', '=>'][Math.floor(Math.random() * 7)]}
            </div>
          ))}
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-6">VibeCode</h1>
            <p className="text-white/90 text-xl max-w-md">
              Elevate your coding experience with AI-powered assistance and collaborative tools.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 rounded-full p-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Smart Code Completion</h3>
                  <p className="text-white/80 mt-1">Get intelligent suggestions as you type, helping you code faster and with fewer errors.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 rounded-full p-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Real-time Collaboration</h3>
                  <p className="text-white/80 mt-1">Work together with your team in real-time, seeing changes as they happen.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6 md:hidden">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                V
              </div>
            </div>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to continue your coding journey
            </p>
          </div>

          <div className="space-y-5">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <GoogleLoginButton className="w-full mb-4" />
              <GitHubLoginButton className="w-full" />

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="relative w-full">
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-gray-500 px-4 py-3 text-sm font-medium text-white opacity-50 cursor-not-allowed"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 3a5 5 0 0 0-5 5v1h2v-1a3 3 0 1 1 6 0v1h2v-1a5 5 0 0 0-5-5z"/>
                  </svg>
                  Email Login
                </button>
                <div className="absolute right-0 top-0 transform -translate-y-1/2 translate-x-1/4 z-10">
                  <span className="bg-yellow-500 text-xs font-bold px-2 py-0.5 rounded-full text-black inline-block">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              By signing in, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>

            <Link to="/" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}