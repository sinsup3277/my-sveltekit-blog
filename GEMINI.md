# Project Overview

This is a SvelteKit project that serves as a personal blog and memo system. It uses Markdown files for content, which are stored in the `memos` directory. The project leverages `gray-matter` to parse frontmatter from Markdown files and `marked` to convert the content into HTML for display.

A key feature is the ability to create, edit, and delete memos. The system also includes a feature to manage IP aliases for memo authors, allowing for the display of a name instead of an IP address.

## Main Technologies

-   **Framework:** SvelteKit
-   **Build Tool:** Vite
-   **Language:** TypeScript
-   **Styling:** CSS in Svelte components
-   **Content:** Markdown with `gray-matter` for frontmatter and `marked` for rendering.

# Building and Running

The following scripts are available in `package.json` to manage the application:

-   **`npm run dev`**: Starts the development server with hot-reloading.
-   **`npm run build`**: Compiles the application for production.
-   **`npm run preview`**: Serves the production build for local testing.
-   **`npm run check`**: Type-checks the codebase using `svelte-check`.
-   **`npm run lint`**: Lints the code using ESLint and checks formatting with Prettier.
-   **`npm run format`**: Automatically formats the entire codebase with Prettier.

# Development Conventions

-   **Code Style:** The project enforces a consistent code style using Prettier and ESLint. All code should be formatted and pass linting checks before being committed.
-   **Structure:** The project follows the standard SvelteKit directory structure.
    -   `src/routes`: Contains the application's pages and API endpoints.
    -   `src/lib`: Holds shared modules, such as `posts.ts` for memo management and `ipManager.ts` for handling IP aliases.
    -   `memos`: Stores all the markdown files that serve as the content for the memos.
-   **Content Management:** Memos are created as `.md` files in the `memos` directory. Each file can contain frontmatter (e.g., `title`, `date`, `ip`) and Markdown content.
-   **API:** Server-side logic for API endpoints is handled in `+server.ts` files within the `src/routes/api` directory.