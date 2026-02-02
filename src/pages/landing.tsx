import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, BarChart3, Clock, Shield, Smartphone } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold">ContentFlow</span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            AI-Powered Social Media Content
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Create consistent, on-brand social media content in minutes with AI. Scale your content strategy without scaling your team.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Start 7-day free trial
            </Link>
            <button className="px-8 py-3 border border-gray-700 hover:border-gray-600 rounded-lg font-semibold transition-colors">
              Watch demo
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">No credit card required</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <Zap className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-400">
              Generate multiple content variations in seconds, not hours. Stay on top of trends.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <Shield className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">On-Brand Guaranteed</h3>
            <p className="text-gray-400">
              AI learns your brand voice and guidelines. Every post stays true to your identity.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <BarChart3 className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Performance</h3>
            <p className="text-gray-400">
              Monitor engagement across platforms and optimize your content strategy with data.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-12 mb-20">
          <h2 className="text-3xl font-bold mb-8">How it works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Set up your brand</h4>
                <p className="text-gray-400">
                  Define your brand voice, values, and guidelines
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Create a brief</h4>
                <p className="text-gray-400">
                  Enter your topic, platform, and creative direction
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Review & refine</h4>
                <p className="text-gray-400">
                  Choose from AI-generated variations and make edits
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Publish or schedule</h4>
                <p className="text-gray-400">
                  Post immediately or schedule for later across platforms
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
            <p className="text-gray-400">Posts created</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
            <p className="text-gray-400">Active users</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">98%</div>
            <p className="text-gray-400">Satisfaction rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
            <p className="text-gray-400">Support available</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-blue-600/10 border border-blue-500/30 rounded-lg p-12 text-center">
          <Smartphone className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <h3 className="text-2xl font-bold mb-4">Works on all devices</h3>
          <p className="text-gray-300 mb-6">
            Create content on desktop, tablet, or mobile. Your content is always synced.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            Start for free
          </Link>
        </div>
      </div>

      <footer className="border-t border-slate-700 bg-slate-900/50 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>
            Built with React, TypeScript, Supabase, and Tailwind CSS
          </p>
          <p className="mt-2 text-sm text-gray-500">
            © 2025 ContentFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
