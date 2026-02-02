# ContentFlow - AI-Powered Social Media Content Generation Platform

ContentFlow is a modern SaaS platform that helps businesses automate content creation, optimize for various social media platforms, and maintain brand consistency across all content.

## Features

### Core Features
- **User Onboarding & Setup**: 7-day free trial with intuitive brand setup wizard
- **AI-Powered Content Generation**: Generates multiple content variations tailored to each platform
- **Brand Consistency**: AI learns from your brand voice, guidelines, and values
- **Content Library**: Centralized repository for all generated posts with search and filtering
- **Analytics Dashboard**: Track engagement metrics and content performance
- **Multi-Platform Support**: Optimized content for Instagram, Twitter, LinkedIn, and Facebook

### Key Capabilities
- 4-step post creation workflow (Brief → Generate → Craft → Finalize)
- Platform-specific content optimization (character limits, tone adjustments)
- Brand settings management with voice customization
- Trial expiration tracking with upgrade prompts
- Real-time content character counting
- Copy-to-clipboard functionality

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Edge Functions**: Deno-based serverless functions
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```
src/
├── lib/
│   ├── supabase.ts              # Supabase client initialization
│   └── auth-context.tsx         # Authentication context and hooks
├── components/
│   ├── protected-route.tsx       # Route protection wrapper
│   ├── post-creation-wizard.tsx  # 4-step post creation flow
│   ├── content-library.tsx       # Content library and post management
│   ├── analytics-dashboard.tsx   # Analytics and performance tracking
│   ├── brand-settings.tsx        # Brand and account settings
│   └── subscription-card.tsx     # Subscription plan cards
├── pages/
│   ├── landing.tsx               # Marketing landing page
│   ├── auth/
│   │   ├── login.tsx            # Login page
│   │   └── signup.tsx           # Signup page
│   ├── onboarding/
│   │   └── onboarding.tsx       # 2-step brand setup wizard
│   └── dashboard/
│       └── dashboard.tsx        # Main dashboard with navigation
├── App.tsx                       # Main app with routing
└── index.css                     # Global styles

supabase/
└── functions/
    └── generate-content/
        └── index.ts             # Edge function for AI content generation
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (already configured in `.env`)

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Database Schema

The platform uses Supabase with the following key tables:

- **profiles**: User account information
- **subscriptions**: Trial and subscription management
- **brands**: Brand configuration and settings
- **brand_voice**: Brand tone and personality
- **platform_configs**: Connected social media accounts
- **audience_segments**: Target audience definitions
- **posts**: Generated social media posts
- **post_variations**: Multiple variations of posts
- **content_library**: Saved content and templates
- **analytics_data**: Post performance metrics
- **automation_rules**: Content automation workflows
- **brand_guidelines**: Uploaded brand documents

All tables have Row Level Security (RLS) enabled for multi-tenant data isolation.

## Authentication Flow

1. Users sign up with email/password
2. Profile and subscription records created automatically
3. Redirected to onboarding for brand setup
4. After onboarding, access to full dashboard
5. Trial period tracked automatically (7 days)

## Content Generation Workflow

1. **Brief**: User provides title, platform, creative direction, and target audience
2. **Generate**: AI generates 3 content variations using Edge Function
3. **Craft**: User edits and refines the selected variation
4. **Finalize**: Preview and save as draft or schedule for publishing

## Edge Functions

### generate-content
- Generates AI content variations based on brand voice
- Accepts: title, platform, creative brief, target audience, brand tone
- Returns: Array of 3 content variations
- Optimized for each platform's character limits

## Customization

### Brand Voice Options
- Professional
- Friendly & Warm
- Bold & Confident
- Creative & Playful
- Educational & Informative

### Supported Platforms
- Instagram (2,200 character limit)
- Twitter (280 character limit)
- LinkedIn (3,000 character limit)
- Facebook (63,206 character limit)

## Security Features

- Row Level Security (RLS) on all tables
- Email/password authentication via Supabase Auth
- Session management with auto-logout
- Secure environment variables
- JWT-based API authentication

## Performance Optimizations

- Code splitting with React Router
- Lazy loading components
- Optimized database queries with indexes
- CSS minification with Tailwind CSS
- Image optimization for faster load times

## Future Enhancements

1. **Direct Social Media Posting**: OAuth integration for automatic posting
2. **AI-Generated Visuals**: Image and video generation
3. **Team Collaboration**: Multi-user workspaces with roles
4. **Content Calendar**: Visual scheduling interface
5. **Advanced Analytics**: AI-powered content recommendations
6. **Custom AI Models**: Fine-tuning on brand-specific content
7. **Integration Hub**: CRM, email marketing, and analytics tools
8. **Mobile App**: Native iOS/Android applications

## Deployment

The application is ready for deployment to:
- Vercel
- Netlify
- AWS Amplify
- Self-hosted servers

All sensitive configuration is handled via environment variables.

## Support

For issues or feature requests, please contact support or open an issue in the repository.

## License

All rights reserved. ContentFlow © 2025
