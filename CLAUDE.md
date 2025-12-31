# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

### Development Commands
- `bun run dev` - Start Next.js development server (localhost:3000)
- `bun run build` - Build the application for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

### Content Creation Tools
- `node scripts/compose.js` - Interactive CLI tool to create new MDX content files
- `python scripts/compose.py` - Alternative Python/Textual-based content creator with TUI

### Important Files
- `CLAUDE.md` - This file, AI assistant guidance
- `GEMINI.md` - Google Gemini assistant guidance (multi-AI support)
- `README.md` - Project documentation and setup instructions
- `prompts/tech-radar.md` - Original planning prompt for the Technology Radar feature

## Architecture Overview

This is a Next.js 14 personal website built with the App Router architecture. The site serves as a content showcase and knowledge management system with seven content types (articles, quotes, ideas, projects, tools, designs, books) and a Technology Radar feature for tracking emerging technologies.

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Runtime**: Bun (NOT npm - always use `bun` commands)
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Database**: Neon (PostgreSQL serverless)
- **Content**: MDX files with gray-matter frontmatter parsing
- **Animations**: GSAP for scroll-triggered effects
- **Data Visualization**: D3.js for Technology Radar visualization
- **Deployment**: Vercel with cron jobs

## Project Structure

```
tyandor-web/
├── app/                       # Next.js App Router pages
│   ├── api/                   # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   │   └── instapaper/   # Instapaper OAuth flow
│   │   └── radar/            # Technology Radar APIs
│   │       ├── sync/         # RSS sync cron endpoint (secured)
│   │       └── technologies/ # CRUD operations for radar entries
│   ├── articles/[slug]/      # Dynamic article pages
│   ├── books/[slug]/         # Dynamic book pages
│   ├── designs/[slug]/       # Dynamic design pages
│   ├── ideas/[id]/           # Dynamic idea pages
│   ├── projects/[slug]/      # Dynamic project pages
│   ├── quotes/[id]/          # Dynamic quote pages
│   ├── tools/[slug]/         # Dynamic tool pages
│   ├── category/[category]/  # Category aggregation pages
│   ├── tag/[tag]/            # Tag aggregation pages
│   ├── categories/           # All categories index
│   ├── tags/                 # All tags index
│   ├── radar/                # Technology Radar management UI
│   ├── setup-integrations/   # API integration setup wizard
│   ├── auth/                 # Authentication pages
│   ├── login/                # Login page
│   ├── about/                # About page
│   ├── components/           # App-level components (see Components section)
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles (imported here)
├── components/               # Global reusable components
│   ├── ui/                   # Shadcn/ui component library (50+ components)
│   └── ContentNavigation.tsx # Prev/next navigation for content
├── lib/                      # Utilities and integrations
│   ├── integrations/         # External API clients
│   │   ├── instapaper.ts     # Instapaper API client
│   │   ├── instapaper-auth.ts # Instapaper OAuth helpers
│   │   └── snipd.ts          # Snipd podcast API client
│   ├── db/                   # Database client configuration
│   │   └── neon.ts           # Neon PostgreSQL client
│   └── utils.ts              # Utility functions (cn, etc.)
├── hooks/                    # Custom React hooks
│   ├── use-mobile.tsx        # Mobile detection hook
│   └── use-toast.ts          # Toast notification hook
├── styles/                   # Stylesheets
│   └── globals.css           # Global CSS with Rosé Pine theme variables
├── types/                    # TypeScript type definitions
│   └── global.d.ts           # Global type declarations
├── scripts/                  # Development and content tools
│   ├── compose.js            # Node.js content creation CLI
│   └── compose.py            # Python/Textual content creation TUI
├── prompts/                  # AI assistant context and planning docs
│   └── tech-radar.md         # Original Tech Radar requirements
├── public/                   # Static assets (images, SVGs, fonts)
├── articles/                 # MDX article files
├── books/                    # MDX book files
├── designs/                  # MDX design files
├── ideas/                    # MDX idea files
├── projects/                 # MDX project files
├── quotes/                   # MDX quote files
├── tools/                    # MDX tool files
├── middleware.ts             # Auth middleware (see Middleware section)
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── vercel.json               # Vercel deployment config (cron jobs)
├── components.json           # Shadcn/ui configuration
├── radar_schema.sql          # Database schema for Tech Radar (basic)
├── radar_schema_complete.sql # Complete database schema
├── CLAUDE.md                 # This file
├── GEMINI.md                 # Gemini AI assistant guidance
└── README.md                 # Project documentation
```

## Content Management System

### Content Types
Content is stored as MDX files in seven type-specific directories at the project root:

1. **Articles** (`/articles`) - Blog posts and long-form content
2. **Books** (`/books`) - Book reviews, notes, and summaries
3. **Designs** (`/designs`) - Design work, mockups, and visual concepts
4. **Ideas** (`/ideas`) - Thoughts, concepts, and brief notes
5. **Projects** (`/projects`) - Portfolio projects and case studies
6. **Quotes** (`/quotes`) - Curated quotes with optional commentary
7. **Tools** (`/tools`) - Tool reviews, guides, and recommendations

### Frontmatter Schema
All content types share core frontmatter fields:
```yaml
title: "Content Title"              # Required
author: "Author Name"               # Required
date: "2024-01-01"                  # Required (YYYY-MM-DD format)
categories: ["Category One", "..."] # Required (array)
tags: ["tag1", "tag2", "..."]      # Required (array)
```

Additional fields vary by content type:
- `description` - Short description (most types)
- `image` - Hero/cover image path (articles, books, designs, projects)
- `link` - External URL (tools, projects)
- `status` - Project status (projects)
- `technologies` - Tech stack array (projects, tools)
- `publisher` - Book publisher (books)
- `isbn` - Book ISBN (books)

**Note**: Frontmatter schemas are fully defined in `scripts/compose.js` and `scripts/compose.py` - reference these for authoritative field definitions when creating content.

### Content Processing
- Content is read server-side using Node.js `fs` module
- Frontmatter parsed with `gray-matter` library
- MDX rendered with `@next/mdx` and `next-mdx-remote`
- Files sorted by date (newest first) by default
- Dynamic routes follow pattern: `/[content-type]/[slug-or-id]`

### Categories & Tags System
- Categories and tags are extracted from frontmatter arrays
- Category pages: `/category/[category-name]` - shows all content with that category
- Tag pages: `/tag/[tag-name]` - shows all content with that tag
- Index pages: `/categories` and `/tags` - show all unique categories/tags
- `CategoryTagDisplay` component (`app/components/CategoryTagDisplay.tsx`) handles rendering with proper styling and navigation
- Both categories and tags support multi-word values (e.g., "Software Engineering", "machine-learning")

## Routing & Pages

### Dynamic Routes
- `app/articles/[slug]/page.tsx` - Article detail pages
- `app/books/[slug]/page.tsx` - Book detail pages
- `app/designs/[slug]/page.tsx` - Design detail pages
- `app/ideas/[id]/page.tsx` - Idea detail pages (uses numeric ID)
- `app/projects/[slug]/page.tsx` - Project detail pages
- `app/quotes/[id]/page.tsx` - Quote detail pages (uses numeric ID)
- `app/tools/[slug]/page.tsx` - Tool detail pages
- `app/category/[category]/page.tsx` - Category aggregation pages
- `app/tag/[tag]/page.tsx` - Tag aggregation pages

### Static Pages
- `app/page.tsx` - Homepage with latest content from all types
- `app/about/page.tsx` - About page
- `app/categories/page.tsx` - All categories index
- `app/tags/page.tsx` - All tags index
- `app/setup-integrations/page.tsx` - API integration setup wizard

### API Routes
- `app/api/auth/instapaper/route.ts` - Instapaper OAuth flow
- `app/api/radar/sync/route.ts` - RSS feed sync cron job (POST only, Bearer token auth)
- `app/api/radar/technologies/route.ts` - Technology CRUD operations

## Components Architecture

### App-Level Components (`app/components/`)
These are page-specific and feature-specific components:

**Animated Components** (GSAP scroll animations):
- `AnimatedArticleCard.tsx` - Article cards with fade-in
- `AnimatedBookCard.tsx` - Book cards with fade-in
- `AnimatedDesignCard.tsx` - Design cards with fade-in
- `AnimatedIdeaCard.tsx` - Idea cards with fade-in
- `AnimatedProjectCard.tsx` - Project cards with fade-in
- `AnimatedQuoteCard.tsx` - Quote cards with fade-in
- `AnimatedToolCard.tsx` - Tool cards with fade-in
- `AnimatedBox.tsx` - Generic animated container
- `AnimatedHomeArticleCard.tsx` - Homepage-specific article cards
- `AnimatedHomeDesignCard.tsx` - Homepage-specific design cards
- `AnimatedHomeQuote.tsx` - Homepage-specific quote display
- `AnimatedHomeToolCard.tsx` - Homepage-specific tool cards
- `AnimatedQuote.tsx` - Standalone animated quote component

**Navigation & Layout**:
- `Navigation.tsx` - Main site navigation with theme toggle
- `Footer.tsx` - Site footer
- `HomeContent.tsx` - Homepage content layout
- `HomeWithLoading.tsx` - Homepage with loading state
- `LoadingAnimation.tsx` - Custom loading spinner/animation

**Feature Components**:
- `TechnologyRadar.tsx` - D3.js visualization of technology quadrants
- `RadarManagement.tsx` - CRUD interface for radar entries
- `RadarWrapper.tsx` - Wrapper for radar component
- `CategoryTagDisplay.tsx` - Category and tag display with links
- `Counter.tsx` - Example counter component
- `ThemeProvider.tsx` - next-themes wrapper component
- `ThemeToggle.tsx` - Dark/light theme toggle button

**Important Animation Pattern**:
- All `Animated*` components use dynamic imports to prevent SSR issues
- GSAP loaded via CDN in root layout
- ScrollTrigger plugin used for viewport-triggered animations
- Components register animations in useEffect hooks

### Global Components (`components/`)
- `ContentNavigation.tsx` - Prev/next navigation for content pages
- `ui/` - 50+ Shadcn/ui components (accordion, alert, button, card, dialog, etc.)

### Shadcn/ui Components (`components/ui/`)
Over 50 pre-built, customizable UI primitives including:
- Layout: `card`, `separator`, `scroll-area`, `resizable`
- Forms: `button`, `input`, `checkbox`, `select`, `slider`, `switch`, `radio-group`, `calendar`
- Feedback: `alert`, `toast`, `progress`, `badge`
- Overlays: `dialog`, `alert-dialog`, `sheet`, `popover`, `tooltip`, `hover-card`, `drawer`
- Navigation: `navigation-menu`, `menubar`, `breadcrumb`, `tabs`, `pagination`
- Data Display: `table`, `avatar`, `aspect-ratio`, `carousel`, `chart`
- Other: `command`, `context-menu`, `dropdown-menu`, `accordion`, `collapsible`

## Styling & Theming

### Tailwind CSS Configuration
- Custom design system defined in `tailwind.config.ts`
- CSS custom properties for HSL color values
- Dark mode: class-based strategy via `next-themes`
- Content paths include app, components, and root-level MDX files

### Color System
**Shadcn/ui Semantic Colors** (defined via CSS variables):
- `background`, `foreground` - Base colors
- `card`, `card-foreground` - Card backgrounds
- `popover`, `popover-foreground` - Popover backgrounds
- `primary`, `primary-foreground` - Primary actions
- `secondary`, `secondary-foreground` - Secondary actions
- `muted`, `muted-foreground` - Muted text/backgrounds
- `accent`, `accent-foreground` - Accent colors
- `destructive`, `destructive-foreground` - Error/danger states
- `border`, `input`, `ring` - UI element outlines
- `chart-1` through `chart-5` - Chart colors
- `sidebar-*` - Sidebar-specific colors

**Rosé Pine Theme** (mentioned in original CLAUDE.md):
- Custom CSS properties: `--color-base`, `--color-surface`, `--color-text`, `--color-love`
- Utility classes: `bg-rosePine-base`, `text-rosePine-text`
- Three variants: base, dawn (light), moon (dark)

**Note**: Color system uses both Rosé Pine custom properties AND Shadcn/ui semantic variables - check `styles/globals.css` for complete definitions.

### Typography
- `@tailwindcss/typography` plugin for prose content
- Custom font loading in root layout
- Responsive typography scales

### Animations
- **GSAP**: Loaded via CDN in root layout for scroll animations
- **Tailwind Animate**: CSS animations for UI elements (accordion, etc.)
- **Custom Keyframes**: `accordion-down`, `accordion-up` defined in Tailwind config

## External API Integrations

### Instapaper Integration
**Purpose**: Sync and manage Instapaper bookmarks

**Setup**:
1. Get OAuth credentials from Instapaper Developer portal
2. Add to `.env.local`: `INSTAPAPER_CONSUMER_KEY`, `INSTAPAPER_CONSUMER_SECRET`
3. Complete OAuth flow at `/setup-integrations`
4. Add returned tokens: `INSTAPAPER_TOKEN`, `INSTAPAPER_TOKEN_SECRET`

**Client**: `lib/integrations/instapaper.ts` (InstapaperClient class)
**Auth Helper**: `lib/integrations/instapaper-auth.ts`
**API Route**: `app/api/auth/instapaper/route.ts`

**Methods**:
- `getBookmarks(limit)` - Fetch bookmarks
- `getFolders()` - Get folder list
- `addBookmark(url, title)` - Save bookmark
- `getBookmarkText(id)` - Get bookmark content

### Snipd Integration
**Purpose**: Access podcast snippets and highlights

**Setup**:
1. Get API key from Snipd Developers
2. Add to `.env.local`: `SNIPD_API_KEY`
3. Test at `/setup-integrations`

**Client**: `lib/integrations/snipd.ts` (SnipdClient class)

**Methods**:
- `getSnippets(limit)` - Fetch snippets
- `searchSnippets(query)` - Search snippets
- `getEpisodes(limit)` - Get episodes
- `getPodcasts(limit)` - Get podcasts
- `createSnippet(episodeId, start, end, text)` - Create snippet

## Technology Radar Feature

The Technology Radar is a key feature for tracking emerging technologies, tools, and techniques with visual quadrant-based representation.

### Database Schema
- **Table**: `technologies` (defined in `radar_schema_complete.sql`)
- **Key Fields**:
  - `id` (UUID primary key)
  - `name` (text) - Technology name
  - `description` (text) - Details
  - `quadrant` (text) - One of: "Tools", "Techniques", "Platforms", "Languages & Frameworks"
  - `ring` (text) - One of: "Adopt", "Trial", "Assess", "Hold"
  - `tags` (text array) - Categorization tags
  - `source_url` (text) - Link to more info (unique constraint for deduplication)
  - `user_id` (UUID) - Owner reference
  - `created_at`, `updated_at` - Timestamps

### Components
- **Visualization**: `app/components/TechnologyRadar.tsx` - D3.js quadrant visualization
- **Management**: `app/components/RadarManagement.tsx` - CRUD interface
- **Wrapper**: `app/components/RadarWrapper.tsx` - Auth-protected wrapper
- **Page**: `app/radar/page.tsx` - Main radar interface

### RSS Sync Automation
**Endpoint**: `app/api/radar/sync/route.ts`
**Method**: POST only
**Authentication**: Bearer token via `CRON_SECRET` environment variable
**Schedule**: Daily at midnight (configured in `vercel.json` cron jobs)

**Process**:
1. Validates bearer token from `Authorization` header
2. Fetches 3 most recent items from each configured RSS feed
3. Parses RSS with `rss-parser`
4. Creates Technology entries with:
   - Name: RSS item title
   - Description: Content snippet
   - Quadrant: "Techniques" (default)
   - Ring: "Assess" (default)
   - Tags: Feed title + "Automated"
   - Source URL: Original article link (deduplication key)
5. Skips items that already exist (based on `source_url`)
6. Returns JSON with `processed`, `added`, and `errors` counts

**Default RSS Feeds** (configured in route handler):
- Nathan's Newsletter (Substack)
- You Are Not So Smart
- Martin Fowler
- O'Reilly Radar
- The T-Shaped Dev
- ByteByteGo
- Red Hat Developers

**Important**: This endpoint is designed for automated cron jobs and should NOT be called manually without proper authorization.

### Vercel Cron Configuration
Configured in `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/radar/sync",
      "schedule": "0 0 * * *"  // Daily at midnight UTC
    }
  ]
}
```

## Environment Variables

### Required for Core Functionality
```bash
# Neon Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### Optional Integrations
```bash
# Instapaper
INSTAPAPER_CONSUMER_KEY=your_consumer_key
INSTAPAPER_CONSUMER_SECRET=your_consumer_secret
INSTAPAPER_TOKEN=your_oauth_token              # After OAuth flow
INSTAPAPER_TOKEN_SECRET=your_token_secret      # After OAuth flow

# Snipd
SNIPD_API_KEY=your_snipd_api_key

# Technology Radar Sync
CRON_SECRET=your_secret_token_for_cron_jobs    # For securing sync endpoint

# Development
NODE_ENV=development                           # or production
```

**Setup Flow**: Visit `/setup-integrations` to configure Instapaper and Snipd integrations with guided OAuth flows.

## Development Guidelines

### When Working with Content
1. **Always read files before editing** - Never propose changes without seeing current content
2. **Use compose scripts** - Don't manually create MDX files; use `node scripts/compose.js`
3. **Validate frontmatter** - Ensure all required fields are present and properly formatted
4. **Test dynamic routes** - Changes to content structure may affect routing

### When Working with Components
1. **Use existing patterns** - Follow Animated* component patterns for new animations
2. **Dynamic imports for animations** - Prevent SSR issues with GSAP components
3. **Leverage Shadcn/ui** - Check `components/ui/` before building custom components
4. **Maintain accessibility** - Shadcn components are accessible by default; preserve this

### When Working with APIs
1. **Check sync endpoint auth** - The sync endpoint requires bearer token authentication via CRON_SECRET
2. **Handle errors gracefully** - All API routes should return proper HTTP status codes
3. **Test integration flows** - Use `/setup-integrations` for OAuth testing

### When Working with Styling
1. **Use Tailwind utilities** - Avoid custom CSS unless absolutely necessary
2. **Check theme variables** - Use semantic color tokens (`background`, `foreground`, etc.)
3. **Test dark/light modes** - Theme toggle should work across all pages
4. **Maintain responsive design** - Mobile-first approach with Tailwind breakpoints

### TypeScript Guidelines
- **Strict mode enabled** - No implicit any, proper type definitions required
- **Type definitions** - Custom types in `types/global.d.ts`
- **Component props** - Always define explicit prop interfaces

### Bun Runtime Requirements
- **NEVER use npm** - All commands must use `bun` (e.g., `bun install`, `bun run dev`)
- **Package installation** - `bun add <package>` for dependencies
- **Script execution** - `bun run <script>` for package.json scripts
- **Direct execution** - `bun <file.ts>` for TypeScript files

## Testing & Debugging

### Local Development
1. Start dev server: `bun run dev`
2. Check console for errors
3. Verify hot reload is working
4. Test all interactive features

### Common Issues
- **GSAP not loading**: Check CDN script in root layout
- **MDX parse errors**: Validate frontmatter YAML syntax
- **Dark mode flicker**: Ensure ThemeProvider wraps entire app
- **Type errors**: Run `bun run lint` and check TypeScript compiler

### Build & Production
```bash
bun run build      # Test production build
bun run start      # Test production server locally
```

## Key Files to Reference

### Configuration
- `next.config.mjs` - Next.js config (MDX support, webpack overrides, image settings)
- `tailwind.config.ts` - Tailwind theme and plugins
- `tsconfig.json` - TypeScript compiler options
- `vercel.json` - Deployment config and cron jobs
- `components.json` - Shadcn/ui configuration
- `.nvmrc` - Node version specification

### Data & Schema
- `radar_schema.sql` - Basic radar database schema
- `radar_schema_complete.sql` - Complete database schema with all tables

### Documentation
- `CLAUDE.md` - This file (Claude AI guidance)
- `GEMINI.md` - Google Gemini AI guidance
- `README.md` - Project documentation
- `LICENSE` - Project license
- `prompts/tech-radar.md` - Original radar feature requirements

## AI Assistant Context

### Multi-AI Support
This project includes guidance files for multiple AI assistants:
- **CLAUDE.md** - This file, optimized for Claude Code
- **GEMINI.md** - Guidance for Google Gemini
- Both files should be kept in sync for consistency

### Prompts Directory
The `/prompts` directory contains planning documents and original requirements:
- `tech-radar.md` - Original Technology Radar feature specification
- Future planning docs should be added here for context preservation

### Best Practices for AI Assistants
1. **Read before writing** - Always read existing files before making changes
2. **Follow established patterns** - Don't introduce new patterns without justification
3. **Respect the stack** - Use Bun, not npm; use existing libraries
4. **Maintain consistency** - Match existing code style and component patterns
5. **Test thoroughly** - Verify changes work in both dev and production builds
6. **Document changes** - Update relevant docs when adding features
7. **Security first** - Never commit secrets; use environment variables
8. **Accessibility matters** - Maintain WCAG compliance in UI components

### When to Update This File
- New features added (especially major ones like Technology Radar)
- New content types created
- New API integrations added
- Routing structure changes
- Build/deployment process changes
- Environment variables added/changed
- Major dependency updates that affect patterns

---

**Last Updated**: 2024-12-24
**Maintainer**: Tyler Andor
**For Questions**: Reference README.md or project documentation
