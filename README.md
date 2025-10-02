# Tyler Andor - Personal Website

A Next.js 14 personal website built with the App Router architecture, featuring content management for articles, quotes, ideas, projects, tools, designs, and books, plus integrations with Instapaper and Snipd.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- bun

### Installation
```bash
git clone <repository-url>
cd tyandor-web
bun install
bun run dev
```

Visit `http://localhost:3000` to see the site.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── articles/[slug]/   # Dynamic article pages
│   ├── quotes/[id]/       # Dynamic quote pages
│   └── components/        # Page-specific components
├── components/            # Reusable components
│   └── ui/               # Shadcn/ui components
├── lib/                  # Utilities and integrations
│   └── integrations/     # API integrations
├── articles/             # MDX content files
├── quotes/               # MDX quote files
├── ideas/                # MDX idea files
├── projects/             # MDX project files
├── tools/                # MDX tool files
├── designs/              # MDX design files
├── books/                # MDX book files
└── scripts/              # Content creation tools
```

## 🛠 Available Scripts

### Development
- `bun run dev` - Start Next.js development server
- `bun run build` - Build the application for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

### Content Creation
- `node scripts/compose.js` - Interactive CLI tool to create new MDX content files
- `python scripts/compose.py` - Alternative Python/Textual-based content creator

## 📝 Content Management

Content is stored as MDX files with frontmatter in type-specific directories:

### Content Types
- **Articles** (`/articles`) - Blog posts and articles
- **Quotes** (`/quotes`) - Curated quotes with commentary  
- **Ideas** (`/ideas`) - Thoughts and concepts
- **Projects** (`/projects`) - Portfolio projects
- **Tools** (`/tools`) - Useful tools and utilities
- **Designs** (`/designs`) - Design work and concepts
- **Books** (`/books`) - Book reviews and notes

### Frontmatter Schema
All content types support:
- `title` - Content title
- `author` - Author name
- `date` - Publication date
- `categories` - Array of categories
- `tags` - Array of tags

Additional fields vary by content type (description, image, link, status, technologies, etc.).

## 🔌 API Integrations

### Instapaper Integration
Sync and display your Instapaper bookmarks.

#### Setup
1. Create an Instapaper app at [Instapaper Developer](https://www.instapaper.com/main/request_oauth_consumer_token)
2. Add credentials to `.env.local`:
```bash
INSTAPAPER_CONSUMER_KEY=your_consumer_key
INSTAPAPER_CONSUMER_SECRET=your_consumer_secret
```
3. Visit `/setup-integrations` to complete OAuth flow
4. Add the returned tokens to `.env.local`:
```bash
INSTAPAPER_TOKEN=your_oauth_token
INSTAPAPER_TOKEN_SECRET=your_token_secret
```

#### Usage
```typescript
import { InstapaperClient } from '@/lib/integrations/instapaper'

const instapaper = new InstapaperClient()

// Get bookmarks
const bookmarks = await instapaper.getBookmarks(25)

// Get folders
const folders = await instapaper.getFolders()

// Add bookmark
const bookmark = await instapaper.addBookmark('https://example.com', 'Title')

// Get bookmark text content
const text = await instapaper.getBookmarkText('bookmark_id')
```

### Snipd Integration
Access your podcast snippets and highlights.

#### Setup
1. Get your API key from [Snipd Developers](https://snipd.com/developers)
2. Add to `.env.local`:
```bash
SNIPD_API_KEY=your_snipd_api_key
```
3. Test connection at `/setup-integrations`

#### Usage
```typescript
import { SnipdClient } from '@/lib/integrations/snipd'

const snipd = new SnipdClient()

// Get snippets
const snippets = await snipd.getSnippets(50)

// Search snippets
const results = await snipd.searchSnippets('productivity')

// Get episodes
const episodes = await snipd.getEpisodes(25)

// Get podcasts
const podcasts = await snipd.getPodcasts(25)

// Create snippet
const snippet = await snipd.createSnippet('episode_id', 120, 180, 'snippet text')
```

### Technology Radar RSS Sync
Automated data gathering for the Technology Radar from RSS feeds.

#### Setup
1. Add required environment variables to `.env.local`:
```bash
CRON_SECRET=your_secret_token_for_cron_jobs
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Configuration
RSS feeds are configured in `app/api/radar/sync/route.ts`:
```typescript
const RSS_FEEDS = [
  'https://martinfowler.com/feed.atom',
  'https://natesnewsletter.substack.com/feed',
  'https://www.oreilly.com/radar/feed/index.xml',
  'https://thetshaped.dev/feed',
  'https://blog.bytebytego.com/feed',
  'https://rss.feedspot.com/software_engineering_rss_feeds/',
  'https://developers.redhat.com/blog/feed'
]
```

#### Usage
Trigger the sync endpoint via POST request (e.g., from a cron job):
```bash
curl -X POST https://your-domain.com/api/radar/sync \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

The endpoint will:
- Fetch the 3 most recent items from each RSS feed
- Create Technology entries in the `technologies` table
- Skip items that already exist (based on source URL)
- Return processing results (processed count, added count, errors)

Each RSS item is added as a Technology with:
- **Name**: RSS item title
- **Description**: RSS item content/snippet
- **Quadrant**: "Techniques"
- **Ring**: "Assess"
- **Tags**: Feed title + "Automated"
- **Source URL**: Link to original article

### API Testing
Visit `/setup-integrations` for a web interface to:
- Complete Instapaper OAuth flow
- Test Snipd API key
- View setup instructions

## 🎨 Styling & Theming

- **CSS Framework**: Tailwind CSS with custom Rosé Pine color scheme
- **Components**: Shadcn/ui component library
- **Theme**: Dark/light mode support via `next-themes`
- **Typography**: `@tailwindcss/typography` for prose content
- **Animations**: GSAP for scroll-triggered animations

### Custom Colors
- `rosePine-*` - Main theme colors
- `rosePineDawn-*` - Light theme variants  
- `rosePineMoon-*` - Dark theme variants

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Instapaper Integration
INSTAPAPER_CONSUMER_KEY=your_consumer_key
INSTAPAPER_CONSUMER_SECRET=your_consumer_secret
INSTAPAPER_TOKEN=your_oauth_token
INSTAPAPER_TOKEN_SECRET=your_token_secret

# Snipd Integration
SNIPD_API_KEY=your_snipd_api_key

# Technology Radar Sync
CRON_SECRET=your_secret_token_for_cron_jobs

# Optional
NODE_ENV=production
```

### Build Optimization
- Static generation for all content pages
- Automatic code splitting
- Image optimization with Next.js Image component
- Built-in caching for API requests

## 🔧 Development

### Adding New Content Types
1. Create directory in project root (e.g., `/videos`)
2. Add MDX files with appropriate frontmatter
3. Create dynamic route in `app/videos/[slug]/page.tsx`
4. Update compose scripts to support new type
5. Add to navigation and listing pages

### Custom Components
- Store reusable components in `/components`
- Page-specific components in `/app/components`
- Use existing patterns for consistency

### Content Navigation
The `ContentNavigation` component provides prev/next navigation between content items. Use it in any content type:

```typescript
<ContentNavigation
  currentSlug={params.slug}
  contentType="articles"
  contentDirectory="articles"
  allContentHref="/articles"
  allContentLabel="All Articles"
/>
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for excellent user experience
- **Caching**: API responses cached for 30-60 minutes
- **Static Generation**: All content pre-rendered at build time

## 🐛 Troubleshooting

### Common Issues
1. **API Integration Errors**: Check environment variables and network connectivity
2. **Build Failures**: Ensure all MDX files have valid frontmatter
3. **Style Issues**: Verify Tailwind classes and custom CSS imports
4. **OAuth Errors**: Check callback URLs and token expiration

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logging.

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.
