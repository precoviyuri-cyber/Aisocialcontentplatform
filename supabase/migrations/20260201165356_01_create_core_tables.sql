/*
  # Core Tables for AI Social Media Content Generation Platform

  1. New Tables
    - `profiles`: User profile information
    - `subscriptions`: User subscription data and trial tracking
    - `brands`: Brand information and configuration
    - `brand_voice`: Brand voice and personality settings
    - `posts`: Generated social media posts
    - `post_variations`: Multiple variations of generated posts
    - `content_library`: Saved content and templates
    - `platform_configs`: Platform-specific settings
    - `audience_segments`: Target audience definitions
    - `automation_rules`: Rules for content automation
    - `brand_guidelines`: Uploaded brand guideline documents
    - `analytics_data`: Post performance metrics
    - `team_members`: Team collaboration support

  2. Security
    - All tables have RLS enabled
    - Policies ensure users can only access their own data
    - Service role can manage all data for admin operations

  3. Key Features
    - Trial period tracking with automatic expiration
    - Multi-platform support with platform-specific configs
    - Comprehensive post tracking and versioning
    - Analytics integration ready
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  company_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  plan_type text NOT NULL DEFAULT 'trial',
  status text NOT NULL DEFAULT 'active',
  trial_starts_at timestamptz DEFAULT now(),
  trial_ends_at timestamptz DEFAULT (now() + INTERVAL '7 days'),
  subscription_starts_at timestamptz,
  subscription_ends_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  post_limit integer DEFAULT 50,
  posts_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  website_url text,
  description text,
  mission text,
  values text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own brand"
  ON brands FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brand"
  ON brands FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brand"
  ON brands FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create brand_voice table
CREATE TABLE IF NOT EXISTS brand_voice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES brands ON DELETE CASCADE,
  tone text NOT NULL,
  personality_traits text[],
  values_alignment integer DEFAULT 50,
  creativity_level integer DEFAULT 50,
  formality_level integer DEFAULT 50,
  custom_instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(brand_id)
);

ALTER TABLE brand_voice ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view brand voice"
  ON brand_voice FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = brand_voice.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage brand voice"
  ON brand_voice FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = brand_voice.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update brand voice"
  ON brand_voice FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = brand_voice.brand_id
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = brand_voice.brand_id
      AND brands.user_id = auth.uid()
    )
  );

-- Create platform_configs table
CREATE TABLE IF NOT EXISTS platform_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES brands ON DELETE CASCADE,
  platform text NOT NULL,
  handle text,
  is_connected boolean DEFAULT false,
  access_token text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(brand_id, platform)
);

ALTER TABLE platform_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view platform configs"
  ON platform_configs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = platform_configs.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage platform configs"
  ON platform_configs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = platform_configs.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update platform configs"
  ON platform_configs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = platform_configs.brand_id
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = platform_configs.brand_id
      AND brands.user_id = auth.uid()
    )
  );

-- Create audience_segments table
CREATE TABLE IF NOT EXISTS audience_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES brands ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  demographics jsonb,
  interests text[],
  pain_points text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE audience_segments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view audience segments"
  ON audience_segments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = audience_segments.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage audience segments"
  ON audience_segments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = audience_segments.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update audience segments"
  ON audience_segments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = audience_segments.brand_id
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = audience_segments.brand_id
      AND brands.user_id = auth.uid()
    )
  );

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  brand_id uuid NOT NULL REFERENCES brands ON DELETE CASCADE,
  title text NOT NULL,
  platform text NOT NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  creative_direction text,
  target_audience text,
  hashtags text[],
  scheduled_at timestamptz,
  posted_at timestamptz,
  performance_score integer,
  engagement_metrics jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own posts"
  ON posts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create post_variations table
CREATE TABLE IF NOT EXISTS post_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts ON DELETE CASCADE,
  content text NOT NULL,
  variation_number integer NOT NULL,
  tone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE post_variations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view post variations"
  ON post_variations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_variations.post_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create post variations"
  ON post_variations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_variations.post_id
      AND posts.user_id = auth.uid()
    )
  );

-- Create brand_guidelines table
CREATE TABLE IF NOT EXISTS brand_guidelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES brands ON DELETE CASCADE,
  name text NOT NULL,
  file_path text NOT NULL,
  file_type text,
  content_summary text,
  extracted_rules text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE brand_guidelines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view brand guidelines"
  ON brand_guidelines FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = brand_guidelines.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage brand guidelines"
  ON brand_guidelines FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = brand_guidelines.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete brand guidelines"
  ON brand_guidelines FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = brand_guidelines.brand_id
      AND brands.user_id = auth.uid()
    )
  );

-- Create content_library table
CREATE TABLE IF NOT EXISTS content_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  post_id uuid REFERENCES posts ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  content text NOT NULL,
  category text,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own library"
  ON content_library FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create library entries"
  ON content_library FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own library"
  ON content_library FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own library"
  ON content_library FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create analytics_data table
CREATE TABLE IF NOT EXISTS analytics_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts ON DELETE CASCADE,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  shares integer DEFAULT 0,
  views integer DEFAULT 0,
  impressions integer DEFAULT 0,
  engagement_rate numeric DEFAULT 0,
  sentiment_score numeric,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view post analytics"
  ON analytics_data FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = analytics_data.post_id
      AND posts.user_id = auth.uid()
    )
  );

-- Create automation_rules table
CREATE TABLE IF NOT EXISTS automation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  brand_id uuid NOT NULL REFERENCES brands ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL,
  trigger_config jsonb,
  action_type text NOT NULL,
  action_config jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own automation rules"
  ON automation_rules FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create automation rules"
  ON automation_rules FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own automation rules"
  ON automation_rules FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own automation rules"
  ON automation_rules FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_brands_user_id ON brands(user_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_brand_id ON posts(brand_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_content_library_user_id ON content_library(user_id);
CREATE INDEX idx_automation_rules_user_id ON automation_rules(user_id);
