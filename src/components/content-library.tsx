import React, { useState, useEffect } from 'react';
import { Search, Filter, Copy, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  title: string;
  content: string;
  platform: string;
  status: string;
  created_at: string;
}

export const ContentLibrary: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadPosts();
  }, [user]);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, filterPlatform, filterStatus]);

  const loadPosts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterPlatform !== 'all') {
      filtered = filtered.filter((post) => post.platform === filterPlatform);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((post) => post.status === filterStatus);
    }

    setFilteredPosts(filtered);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await supabase.from('posts').delete().eq('id', postId);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: 'bg-pink-600/20 text-pink-300',
      twitter: 'bg-blue-600/20 text-blue-300',
      linkedin: 'bg-blue-700/20 text-blue-300',
      facebook: 'bg-blue-600/20 text-blue-300',
    };
    return colors[platform] || 'bg-gray-600/20 text-gray-300';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-yellow-600/20 text-yellow-300',
      scheduled: 'bg-blue-600/20 text-blue-300',
      published: 'bg-green-600/20 text-green-300',
    };
    return colors[status] || 'bg-gray-600/20 text-gray-300';
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-6">Content Library</h1>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-4">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All platforms</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
          <p className="text-gray-400 mb-4">
            {posts.length === 0 ? 'No posts yet' : 'No posts match your filters'}
          </p>
          {posts.length === 0 && (
            <p className="text-gray-500 text-sm">Create your first post to get started</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                  <div className="flex gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlatformColor(post.platform)}`}>
                      {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm line-clamp-3 mb-4">{post.content}</p>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyContent(post.content)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-gray-400 hover:text-gray-300"
                    title="Copy content"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-gray-400 hover:text-gray-300"
                    title="Edit post"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 hover:bg-red-900/30 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
