# Gemini Project Context: tyandor-web

## Project Overview

This is a personal website for Tyler Andor, built with Next.js 14 and the App Router architecture. It serves as a content hub for various types of content, including articles, quotes, ideas, projects, tools, designs, books, and a Technology Radar. The content is primarily managed through MDX files with frontmatter, while the Technology Radar is powered by a Neon Postgres database. The project also integrates with Instapaper and Snipd to display bookmarks and podcast snippets.

**Key Technologies:**

*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS with a custom Rosé Pine color scheme
*   **UI Components:** shadcn/ui
*   **Content:** MDX with `gray-matter` for frontmatter and `next-mdx-remote` for rendering
*   **Database:** Neon (Postgres) for Technology Radar
*   **Visualization:** D3.js for Technology Radar
*   **Animations:** GSAP
*   **Integrations:** Instapaper, Snipd

## Building and Running

### Prerequisites

*   Node.js 18+
*   bun

### Installation and Development

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd tyandor-web
    ```
3.  **Install dependencies:**
    ```bash
    bun install
    ```
4.  **Run the development server:**
    ```bash
    bun run dev
    ```
    The application will be available at `http://localhost:3000`.

### Key Scripts

*   `bun run dev`: Starts the Next.js development server.
*   `bun run build`: Builds the application for production.
*   `bun run start`: Starts the production server.
*   `bun run lint`: Runs ESLint to check for code quality.

### Content Creation

New content can be created using the interactive CLI tools. The Python script provides a rich Terminal User Interface (TUI) built with Textual.

*   `node scripts/compose.js`: Basic command-line interface.
*   `python scripts/compose.py`: Interactive TUI for creating all content types. Requires `textual`.

## Development Conventions

### Project Structure

*   `app/`: Contains the Next.js App Router pages, including dynamic routes for each content type.
*   `app/radar/`: Contains the Technology Radar page and logic.
*   `components/`: Reusable React components, with UI components from shadcn/ui in `components/ui/`.
*   `lib/`: Utility functions and API integrations.
*   `articles/`, `quotes/`, `ideas/`, etc.: Directories containing the MDX content files.
*   `scripts/`: Scripts for content creation and other tasks.

### Content Management

All content (except the Radar) is stored in MDX files with YAML frontmatter. Each content type has its own directory in the project root. The frontmatter schema is defined in the `README.md`.

### Database & Technology Radar

The Technology Radar data is stored in a Neon Postgres database.
*   **Schema:** Defined in `radar_schema_complete.sql`.
*   **Tables:** `technologies` and `technology_history`.
*   **Access:** Managed via `@neondatabase/serverless` in `app/radar/page.tsx` and related components.

### API Integrations

The project integrates with:
*   **Instapaper & Snipd:** Client-side code in `lib/integrations/`.
*   **Neon Database:** Server-side connection for Radar data.

API keys and connection strings (e.g., `RADAR_POSTGRES_URL`) should be stored in a `.env.local` file.

### Styling

The project uses Tailwind CSS for styling, with a custom color scheme based on Rosé Pine. The `tailwind.config.ts` file contains the theme configuration. The UI is built with shadcn/ui components, which are located in `components/ui/`.
