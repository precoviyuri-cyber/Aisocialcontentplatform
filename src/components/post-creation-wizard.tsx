import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Copy, Check } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { supabase } from '../lib/supabase';

interface PostData {
  title: string;
  platform: string;
  creativeBrief: string;
  targetAudience: string;
  content: string;
}

interface PostCreationWizardProps {
  onComplete: () => void;
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📷', maxChars: 2200 },
  { id: 'twitter', name: 'Twitter', icon: '𝕏', maxChars: 280 },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', maxChars: 3000 },
  { id: 'facebook', name: 'Facebook', icon: '👤', maxChars: 63206 },
];

export const PostCreationWizard: React.FC<PostCreationWizardProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [postData, setPostData] = useState<PostData>({
    title: '',
    platform: 'instagram',
    creativeBrief: '',
    targetAudience: '',
    content: '',
  });
  const [variations, setVariations] = useState<string[]>([]);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const currentPlatform = PLATFORMS.find((p) => p.id === postData.platform);

  const handleBriefSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postData.title || !postData.platform || !postData.creativeBrief) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleGenerateContent = async () => {
    setLoading(true);
    setError('');

    try {
      if (!user) throw new Error('Not authenticated');

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!brand) throw new Error('Brand not found');

      const { data: voice } = await supabase
        .from('brand_voice')
        .select('tone')
        .eq('brand_id', brand.id)
        .maybeSingle();

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          title: postData.title,
          platform: postData.platform,
          creativeBrief: postData.creativeBrief,
          targetAudience: postData.targetAudience,
          brandVoice: voice?.tone || 'professional',
          variations: 3,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const result = await response.json();
      setVariations(result.variations);
      setSelectedVariation(0);
      setPostData({ ...postData, content: result.variations[0] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(postData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalize = async () => {
    setLoading(true);
    setError('');

    try {
      if (!user) throw new Error('User not authenticated');

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!brand) throw new Error('Brand not found');

      await supabase.from('posts').insert({
        user_id: user.id,
        brand_id: brand.id,
        title: postData.title,
        platform: postData.platform,
        content: postData.content,
        creative_direction: postData.creativeBrief,
        target_audience: postData.targetAudience,
        status: 'draft',
      });

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Create a post</h1>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 w-2 rounded-full transition-all ${
                s <= step ? 'bg-blue-600 w-8' : 'bg-slate-700'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6">Step 1: Brief</h2>

          <form onSubmit={handleBriefSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Post title *
              </label>
              <input
                type="text"
                value={postData.title}
                onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="e.g., Product Launch Announcement"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Platform *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PLATFORMS.map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => setPostData({ ...postData, platform: platform.id })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      postData.platform === platform.id
                        ? 'border-blue-600 bg-blue-600/10'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{platform.icon}</div>
                    <div className="text-sm font-medium text-white">{platform.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target audience
              </label>
              <input
                type="text"
                value={postData.targetAudience}
                onChange={(e) =>
                  setPostData({ ...postData, targetAudience: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="e.g., Tech entrepreneurs, small business owners"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Creative direction *
              </label>
              <textarea
                value={postData.creativeBrief}
                onChange={(e) =>
                  setPostData({ ...postData, creativeBrief: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="What should this post communicate? Any specific tone, message, or angle?"
                rows={4}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6">Step 2: Generate</h2>

          {variations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-6">
                AI will generate multiple variations for you to choose from
              </p>
              <button
                onClick={handleGenerateContent}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {loading ? 'Generating...' : 'Generate content'}
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Choose a variation:
                </label>
                <div className="space-y-3">
                  {variations.map((variant, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedVariation(idx);
                        setPostData({ ...postData, content: variant });
                      }}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedVariation === idx
                          ? 'border-blue-600 bg-blue-600/10'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <p className="text-white text-sm line-clamp-3">{variant}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateContent}
                disabled={loading}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Generate more variations
                <RefreshCw className="w-4 h-4" />
              </button>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6">Step 3: Craft</h2>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Edit your content:
                </label>
                <button
                  onClick={handleCopyContent}
                  className="flex items-center gap-2 text-gray-400 hover:text-gray-300 text-sm transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={postData.content}
                onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 font-mono text-sm"
                rows={8}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">
                  {postData.content.length} / {currentPlatform?.maxChars} characters
                </p>
                {postData.content.length > (currentPlatform?.maxChars || 280) && (
                  <p className="text-xs text-red-400">Content exceeds platform limit</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6">Step 4: Finalize</h2>

          <div className="space-y-6">
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-300 mb-3">Post preview:</p>
              <div className="bg-slate-900 rounded p-4 text-white text-sm whitespace-pre-wrap">
                {postData.content}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Platform</p>
                <p className="text-white font-medium">
                  {PLATFORMS.find((p) => p.id === postData.platform)?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <p className="text-white font-medium">Draft</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleFinalize}
                disabled={loading}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-medium rounded-lg transition-colors"
              >
                {loading ? 'Saving...' : 'Save & finish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
