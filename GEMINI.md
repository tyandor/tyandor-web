# Gemini Project Context: tyandor-web

## Project Overview

This is a personal website for Tyler Andor, built with Next.js 14 and the App Router architecture. It serves as a content hub for various types of content, including articles, quotes, ideas, projects, tools, designs, and books. The content is managed through MDX files with frontmatter. The project also integrates with Instapaper and Snipd to display bookmarks and podcast snippets.

**Key Technologies:**

*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS with a custom Rosé Pine color scheme
*   **UI Components:** shadcn/ui
*   **Content:** MDX with `gray-matter` for frontmatter and `next-mdx-remote` for rendering
*   **Animations:** GSAP
*   **Integrations:** Instapaper, Snipd

## Building and Running

### Prerequisites

*   Node.js 18+
*   npm or yarn

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
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

### Key Scripts

*   `npm run dev`: Starts the Next.js development server.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Runs ESLint to check for code quality.

### Content Creation

New content can be created using the interactive CLI tools:

*   `node scripts/compose.js`
*   `python scripts/compose.py`

## Development Conventions

### Project Structure

*   `app/`: Contains the Next.js App Router pages, including dynamic routes for each content type.
*   `components/`: Reusable React components, with UI components from shadcn/ui in `components/ui/`.
*   `lib/`: Utility functions and API integrations.
*   `articles/`, `quotes/`, `ideas/`, etc.: Directories containing the MDX content files.
*   `scripts/`: Scripts for content creation and other tasks.

### Content Management

All content is stored in MDX files with YAML frontmatter. Each content type has its own directory in the project root. The frontmatter schema is defined in the `README.md` and includes fields like `title`, `author`, `date`, `categories`, and `tags`.

### API Integrations

The project integrates with the Instapaper and Snipd APIs. The client-side code for these integrations is located in `lib/integrations/`. API keys and other credentials should be stored in a `.env.local` file.

### Styling

The project uses Tailwind CSS for styling, with a custom color scheme based on Rosé Pine. The `tailwind.config.ts` file contains the theme configuration. The UI is built with shadcn/ui components, which are located in `components/ui/`.
