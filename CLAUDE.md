# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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
- Uses Tailwind CSS with custom color scheme based on Rosé Pine theme
- Custom color variables: `rosePine-*`, `rosePineDawn-*`, `rosePineMoon-*`
- Dark/light theme support via `next-themes` with system preference detection
- Shadcn/ui component library for UI primitives

### Animation & Interactions
- GSAP for scroll-triggered animations
- Dynamic imports for animated components to prevent SSR issues
- Animated components follow naming pattern: `Animated*Card`, `Animated*Box`

### Key Patterns
- Server-side content processing in page components
- Dynamic routing with `[slug]` and `[id]` patterns for content pages
- Consistent layout structure with header navigation and footer
- Image optimization with Next.js Image component
- SVG logo and icons stored in `/public`

### File Structure
- `/app` - Next.js App Router pages and components
- `/components/ui` - Shadcn/ui reusable components
- `/lib/utils.ts` - Utility functions (cn for className merging)
- `/scripts` - Content creation automation tools
- Content directories at root level contain `.mdx` files with frontmatter

### Content Types Schema
Each content type has specific frontmatter requirements as defined in the compose scripts. All types include: title, author, date, categories, tags. Additional fields vary by type (description, image, link, status, technologies, etc.).

### Categories and Tags
- Content supports both `categories` (array) and `tags` (array) in frontmatter
- Categories and tags are displayed on all content types with links to filtered views
- Category pages: `/category/[category-name]` - shows all content with that category
- Tag pages: `/tag/[tag-name]` - shows all content with that tag
- `CategoryTagDisplay` component handles rendering with proper styling and navigation