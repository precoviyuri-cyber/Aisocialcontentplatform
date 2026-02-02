import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { supabase } from '../../lib/supabase';
import { ChevronRight, FileUp } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [brandData, setBrandData] = useState({
    name: '',
    website: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    tone: '',
  });

  const [brandEssence, setBrandEssence] = useState({
    mission: '',
    values: '',
    personalityTraits: [] as string[],
  });

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user) throw new Error('User not authenticated');

      const { data: brandResult, error: brandError } = await supabase
        .from('brands')
        .insert({
          user_id: user.id,
          name: brandData.name,
          website_url: brandData.website,
        })
        .select()
        .single();

      if (brandError) throw brandError;

      const { error: voiceError } = await supabase.from('brand_voice').insert({
        brand_id: brandResult.id,
        tone: brandData.tone,
        personality_traits: brandEssence.personalityTraits,
        custom_instructions: `Mission: ${brandEssence.mission}\nValues: ${brandEssence.values}`,
      });

      if (voiceError) throw voiceError;

      if (brandData.instagram || brandData.twitter || brandData.linkedin) {
        const platforms = [
          { name: 'instagram', handle: brandData.instagram },
          { name: 'twitter', handle: brandData.twitter },
          { name: 'linkedin', handle: brandData.linkedin },
        ].filter((p) => p.handle);

        for (const platform of platforms) {
          await supabase.from('platform_configs').insert({
            brand_id: brandResult.id,
            platform: platform.name,
            handle: platform.handle,
          });
        }
      }

      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save brand');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Let's set up your brand</h1>
          <p className="text-gray-400">Step {step} of 2</p>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {step === 1 ? (
          <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
            <form onSubmit={handleBrandSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Brand Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Brand name *
                  </label>
                  <input
                    type="text"
                    value={brandData.name}
                    onChange={(e) => setBrandData({ ...brandData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Your brand name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={brandData.website}
                    onChange={(e) => setBrandData({ ...brandData, website: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instagram handle
                  </label>
                  <input
                    type="text"
                    value={brandData.instagram}
                    onChange={(e) => setBrandData({ ...brandData, instagram: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="@yourbrand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Twitter handle
                  </label>
                  <input
                    type="text"
                    value={brandData.twitter}
                    onChange={(e) => setBrandData({ ...brandData, twitter: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="@yourbrand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    value={brandData.linkedin}
                    onChange={(e) => setBrandData({ ...brandData, linkedin: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="your-company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Brand tone *
                  </label>
                  <select
                    value={brandData.tone}
                    onChange={(e) => setBrandData({ ...brandData, tone: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select a tone</option>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly & Warm</option>
                    <option value="bold">Bold & Confident</option>
                    <option value="creative">Creative & Playful</option>
                    <option value="educational">Educational & Informative</option>
                  </select>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-white mt-8">Brand Essence</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mission statement
                </label>
                <textarea
                  value={brandEssence.mission}
                  onChange={(e) => setBrandEssence({ ...brandEssence, mission: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="What is your brand's mission?"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Core values
                </label>
                <textarea
                  value={brandEssence.values}
                  onChange={(e) => setBrandEssence({ ...brandEssence, values: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="What are your brand values?"
                  rows={3}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !brandData.name || !brandData.tone}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Brand guidelines (optional)</h2>

            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center mb-6">
              <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">Upload your brand guidelines</p>
              <p className="text-gray-500 text-sm mb-4">PDF, Word, Text, or Markdown files</p>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.md"
              />
              <button
                type="button"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Choose file
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick tips</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>You can add brand guidelines later from the Brand Studio</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>AI will learn from your brand details to create on-brand content</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>Update your brand info anytime in settings</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Complete setup <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
