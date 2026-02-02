import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { supabase } from '../lib/supabase';
import { Save, AlertCircle } from 'lucide-react';

interface BrandData {
  id: string;
  name: string;
  website_url: string;
  mission: string;
  values: string;
}

interface VoiceData {
  id: string;
  tone: string;
  custom_instructions: string;
}

interface ProfileData {
  full_name: string;
  email: string;
}

export const BrandSettings: React.FC = () => {
  const { user } = useAuth();
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [voice, setVoice] = useState<VoiceData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData as ProfileData);
      }

      const { data: brandData } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (brandData) {
        setBrand(brandData as BrandData);

        const { data: voiceData } = await supabase
          .from('brand_voice')
          .select('*')
          .eq('brand_id', brandData.id)
          .single();

        if (voiceData) {
          setVoice(voiceData as VoiceData);
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBrand = async () => {
    if (!brand) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const { error: updateError } = await supabase
        .from('brands')
        .update({
          name: brand.name,
          website_url: brand.website_url,
          mission: brand.mission,
          values: brand.values,
        })
        .eq('id', brand.id);

      if (updateError) throw updateError;

      if (voice) {
        await supabase
          .from('brand_voice')
          .update({
            tone: voice.tone,
            custom_instructions: voice.custom_instructions,
          })
          .eq('id', voice.id);
      }

      setMessage('Brand settings updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update brand');
    } finally {
      setSaving(false);
    }
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
      <h1 className="text-3xl font-bold text-white">Settings</h1>

      {message && (
        <div className="p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 flex gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Account Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full name
              </label>
              <input
                type="text"
                value={profile?.full_name || ''}
                onChange={(e) =>
                  setProfile({ ...profile!, full_name: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save profile
            </button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Subscription</h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">Plan</p>
              <p className="text-white font-medium">7-day free trial</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Status</p>
              <p className="text-white font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Active
              </p>
            </div>

            <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors mt-4">
              Upgrade plan
            </button>
          </div>
        </div>
      </div>

      {brand && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Brand Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Brand name
              </label>
              <input
                type="text"
                value={brand.name}
                onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                value={brand.website_url || ''}
                onChange={(e) => setBrand({ ...brand, website_url: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Brand mission
              </label>
              <textarea
                value={brand.mission || ''}
                onChange={(e) => setBrand({ ...brand, mission: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Brand values
              </label>
              <textarea
                value={brand.values || ''}
                onChange={(e) => setBrand({ ...brand, values: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                rows={3}
              />
            </div>

            {voice && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand tone
                </label>
                <select
                  value={voice.tone}
                  onChange={(e) => setVoice({ ...voice, tone: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly & Warm</option>
                  <option value="bold">Bold & Confident</option>
                  <option value="creative">Creative & Playful</option>
                  <option value="educational">Educational & Informative</option>
                </select>
              </div>
            )}

            <button
              onClick={handleSaveBrand}
              disabled={saving}
              className="md:col-span-2 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save brand settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
