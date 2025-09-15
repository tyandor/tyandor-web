# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `bun run dev` - Start Next.js development server
- `bun run build` - Build the application for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

### Content Creation
- `node scripts/compose.js` - Interactive CLI tool to create new MDX content files
- `python scripts/compose.py` - Alternative Python/Textual-based content creator

## Architecture

This is a Next.js 14 personal website built with the App Router architecture. The site serves as a content showcase for articles, quotes, ideas, projects, tools, designs, and books.

### Content Management
- Content is stored as MDX files in directories: `/articles`, `/quotes`, `/ideas`, `/projects`, `/tools`, `/designs`, `/books`
- Each content type has its own directory with corresponding `.mdx` files
- Front matter schema varies by content type (defined in compose scripts)
- Content is processed server-side using `gray-matter` and `fs` for file system operations

### Styling & Theming
- Uses Tailwind CSS with custom Rosé Pine color scheme implemented via CSS custom properties
- Custom color variables: `--color-base`, `--color-surface`, `--color-text`, `--color-love`, etc. with utilities like `bg-rosePine-base`, `text-rosePine-text`
- Dark/light theme support via `next-themes` with system preference detection and class-based theme switching
- Shadcn/ui component library for UI primitives
- Typography styling with `@tailwindcss/typography` for prose content

### Animation & Interactions
- GSAP for scroll-triggered animations loaded via external CDN scripts in layout
- Dynamic imports for animated components to prevent SSR issues
- Animated components follow naming pattern: `Animated*Card`, `Animated*Box`
- Custom loading animation and theme provider wrapping

### Key Patterns
- Server-side content processing in page components
- Dynamic routing with `[slug]` and `[id]` patterns for content pages
- Consistent layout structure with header navigation and footer
- Image optimization with Next.js Image component
- SVG logo and icons stored in `/public`

### File Structure
- `/app` - Next.js App Router pages and components with app-level components in `/app/components`
- `/components/ui` - Shadcn/ui reusable components
- `/components` - Global reusable components (ContentNavigation, etc.)
- `/lib/utils.ts` - Utility functions (cn for className merging)
- `/lib/integrations` - API integration clients (Instapaper, Snipd)
- `/scripts` - Content creation automation tools (Node.js and Python versions)
- `/hooks` - Custom React hooks
- Content directories at root level contain `.mdx` files with frontmatter

### Content Types Schema
Each content type has specific frontmatter requirements as defined in the compose scripts. All types include: title, author, date, categories, tags. Additional fields vary by type (description, image, link, status, technologies, etc.).

### Categories and Tags
- Content supports both `categories` (array) and `tags` (array) in frontmatter
- Categories and tags are displayed on all content types with links to filtered views
- Category pages: `/category/[category-name]` - shows all content with that category
- Tag pages: `/tag/[tag-name]` - shows all content with that tag
- `CategoryTagDisplay` component handles rendering with proper styling and navigation

### Runtime
- Project uses Bun as the package manager and runtime (not npm)
- All package scripts use `bun run` instead of `npm run`
- File system operations use Node.js `fs` module with server-side rendering

### Authentication & Data
- Supabase integration for authentication and database operations
- Setup at `/setup-integrations` for API integrations (Instapaper, Snipd)
- Environment variables required for external API integrations
- Tech radar feature with user authentication at `/radar`

### Configuration
- Next.js 14 with App Router and MDX support via `@next/mdx`
- Tailwind CSS with Shadcn/ui components and custom design system
- SVG images allowed in Next.js config for logo/icon support
- TypeScript throughout with strict configuration