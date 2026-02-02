import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, MessageCircle, Share2, Eye } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  title: string;
  platform: string;
  engagement_metrics: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };
  created_at: string;
}

interface AnalyticsMetrics {
  totalPosts: number;
  totalEngagement: number;
  avgEngagementRate: number;
  topPlatform: string;
}

export const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalPosts: 0,
    totalEngagement: 0,
    avgEngagementRate: 0,
    topPlatform: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts(data || []);

      if (data && data.length > 0) {
        const totalEngagement = data.reduce((sum, post) => {
          const metrics = post.engagement_metrics || {};
          return sum + (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
        }, 0);

        const platformCounts = {} as Record<string, number>;
        data.forEach((post) => {
          platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
        });

        const topPlatform = Object.entries(platformCounts).sort(
          ([, a], [, b]) => b - a
        )[0]?.[0] || '';

        setMetrics({
          totalPosts: data.length,
          totalEngagement,
          avgEngagementRate: totalEngagement / data.length,
          topPlatform,
        });
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: 'from-pink-600 to-pink-700',
      twitter: 'from-blue-600 to-blue-700',
      linkedin: 'from-blue-700 to-blue-800',
      facebook: 'from-blue-600 to-blue-700',
    };
    return colors[platform] || 'from-gray-600 to-gray-700';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Posts</p>
              <p className="text-3xl font-bold text-white">{metrics.totalPosts}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Engagement</p>
              <p className="text-3xl font-bold text-white">{metrics.totalEngagement}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Avg Engagement</p>
              <p className="text-3xl font-bold text-white">{metrics.avgEngagementRate.toFixed(1)}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Top Platform</p>
              <p className="text-2xl font-bold text-white capitalize">{metrics.topPlatform || 'N/A'}</p>
            </div>
            <Share2 className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">Top Performing Posts</h2>

        {posts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No posts yet. Create your first post to see analytics.</p>
        ) : (
          <div className="space-y-4">
            {posts
              .sort(
                (a, b) =>
                  ((b.engagement_metrics?.likes || 0) +
                    (b.engagement_metrics?.comments || 0) +
                    (b.engagement_metrics?.shares || 0)) -
                  ((a.engagement_metrics?.likes || 0) +
                    (a.engagement_metrics?.comments || 0) +
                    (a.engagement_metrics?.shares || 0))
              )
              .slice(0, 5)
              .map((post) => {
                const engagement =
                  (post.engagement_metrics?.likes || 0) +
                  (post.engagement_metrics?.comments || 0) +
                  (post.engagement_metrics?.shares || 0);

                return (
                  <div
                    key={post.id}
                    className={`bg-gradient-to-r ${getPlatformColor(
                      post.platform
                    )} rounded-lg p-4`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white line-clamp-1">{post.title}</h3>
                        <p className="text-white/80 text-sm capitalize">{post.platform}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{engagement}</p>
                        <p className="text-white/80 text-sm">engagement</p>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-3 pt-3 border-t border-white/20">
                      <div className="flex items-center gap-1 text-white/80">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">
                          {post.engagement_metrics?.views || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-white/80">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">
                          {post.engagement_metrics?.comments || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-white/80">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm">
                          {post.engagement_metrics?.shares || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
