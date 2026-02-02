import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { supabase } from '../../lib/supabase';
import { Sparkles, Home, FileText, BarChart3, Settings, LogOut, Plus } from 'lucide-react';
import { PostCreationWizard } from '../../components/post-creation-wizard';
import { ContentLibrary } from '../../components/content-library';
import { AnalyticsDashboard } from '../../components/analytics-dashboard';
import { BrandSettings } from '../../components/brand-settings';

interface SubscriptionData {
  plan_type: string;
  trial_ends_at: string;
  posts_used: number;
  post_limit: number;
}

interface BrandData {
  id: string;
  name: string;
}

export const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (subData) {
          setSubscription(subData);
          if (subData.trial_ends_at) {
            const daysLeft = Math.ceil(
              (new Date(subData.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );
            setTrialDaysLeft(Math.max(0, daysLeft));
          }
        }

        const { data: brandData } = await supabase
          .from('brands')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (brandData) {
          setBrand(brandData);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <span className="font-bold text-white">ContentFlow</span>
          </div>
          <p className="text-xs text-gray-400">{brand?.name || 'Your Brand'}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'home'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-slate-700'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-slate-700'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>Create Post</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'library'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Content Library</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-slate-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 m-4 text-gray-400 hover:bg-slate-700 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          {activeTab === 'home' && <HomeTab subscription={subscription} />}
          {activeTab === 'create' && (
            <CreateTab
              onPostCreated={() => {
                setActiveTab('library');
              }}
            />
          )}
          {activeTab === 'library' && <LibraryTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'settings' && <SettingsTab brand={brand} />}
        </div>
      </main>
    </div>
  );
};

const HomeTab: React.FC<{ subscription: any }> = ({ subscription }) => {
  const trialDaysLeft = subscription
    ? Math.ceil(
        (new Date(subscription.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Welcome to ContentFlow</h1>

      {subscription && subscription.plan_type === 'trial' && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">You're on a free trial</h2>
          <p className="mb-4">{Math.max(0, trialDaysLeft)} days left to explore</p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 font-medium px-6 py-2 rounded-lg transition-colors">
            Upgrade now
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <p className="text-gray-400 text-sm mb-2">Posts Created</p>
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500 mt-2">
            {subscription?.posts_used} of {subscription?.post_limit}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <p className="text-gray-400 text-sm mb-2">Published</p>
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500 mt-2">This month</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <p className="text-gray-400 text-sm mb-2">Total Engagement</p>
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500 mt-2">Across all posts</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Next steps</h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold">1</span>
            <div>
              <p className="font-medium">Set up your brand</p>
              <p className="text-sm text-gray-400">Complete your brand profile and voice settings</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold">2</span>
            <div>
              <p className="font-medium">Create your first post</p>
              <p className="text-sm text-gray-400">Generate AI-powered content for your audience</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold">3</span>
            <div>
              <p className="font-medium">Connect your platforms</p>
              <p className="text-sm text-gray-400">Link your social media accounts for easy posting</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

interface CreateTabProps {
  onPostCreated: () => void;
}

const CreateTab: React.FC<CreateTabProps> = ({ onPostCreated }) => (
  <PostCreationWizard onComplete={onPostCreated} />
);

const LibraryTab: React.FC = () => <ContentLibrary />;

const AnalyticsTab: React.FC = () => <AnalyticsDashboard />;

const SettingsTab: React.FC<{ brand: any }> = () => <BrandSettings />;
