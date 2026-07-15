# CLAUDE.md

Guidance for coding agents working in this repository. Human setup and
contribution instructions live in `README.md` and `CONTRIBUTING.md`.

## Commands

Run commands from the repository root:

```bash
pnpm run dev              # Start both frontend (Vite :5173) and backend (:8081) concurrently
pnpm run test-db:up       # Start PostgreSQL test DB via Docker
pnpm run test-db:down     # Stop test DB
pnpm run repopulate-db    # Load mock data into test DB
```

### Build & Validate
```bash
pnpm run build            # Build all workspaces
pnpm run check:ts         # TypeScript type checking across all packages
pnpm run lint             # Biome format + lint check
pnpm run lint:fix         # Biome auto-fix format + safe lint fixes
pnpm run check:deps       # pnpm peers check (run after changing deps)
pnpm run validate         # Full validation: lint + check:ts + build + test
# CI: .github/workflows/deps.yml runs peers + deprecation checks when pnpm-lock.yaml changes
```

### Testing
```bash
pnpm run test                                          # All tests across workspaces
pnpm --filter frontend test                            # Frontend tests only
pnpm --filter badgehub-api test                        # Backend tests only
pnpm --filter frontend exec vitest run src/path/to/file.test.ts   # Single test file
pnpm --filter frontend exec vitest run --reporter=verbose         # Verbose output from frontend package
# Or cd packages/frontend && pnpm exec vitest run ... (from package dir)
```

### Database Migrations
```bash
pnpm --filter badgehub-api run db-migrate:up    # Run pending migrations
pnpm --filter badgehub-api run db-migrate:down  # Rollback last migration
pnpm --filter badgehub-api run db-migrate:create -- migration-name  # Create new migration
```

### Code Quality
```bash
pnpm run lint:fix           # Auto-fix with Biome (format + safe lint fixes)
# Git hooks: lefthook runs biome on staged files at pre-commit
# Config: biome.json (formatter + recommended linter rules)
```

## Architecture

- `packages/frontend`: React 19, Vite, Tailwind CSS v4, and DaisyUI v5
- `packages/backend`: Express, PostgreSQL, and PM2
- `packages/shared`: shared types, Zod schemas, and ts-rest API contracts
- `packages/backend/migrations`: db-migrate JavaScript and SQL migrations

API contracts are defined once under `packages/shared/src/contracts` and
consumed by both the typed frontend client and backend routers. Update all
consumers when a contract changes.

## Frontend development

The frontend script copies `index-indirect-dev.html` to `dist/index.html` before
starting Vite on port 5173. The backend serves that HTML on port 8081 and
injects runtime configuration. Test the application through port 8081.

Tailwind is provided by `@tailwindcss/vite`; `postcss.config.js` intentionally
stays empty. Do not add Tailwind or DaisyUI CDN links to the HTML templates.

## Authentication and database

The frontend uses `keycloak-js`; the backend verifies JWTs with `jose`. Never
put Keycloak client secrets in frontend code. There are no bundled application
credentials.

Database changes require a migration with both up and down SQL. Fixture
repopulation is destructive. `DEV_USER_SUB` can make generated projects belong
to a development Keycloak user.

## Production

The single-stage Dockerfile installs dependencies, builds both workspaces, and
runs the backend through PM2. The backend serves the compiled frontend.

## Style and commits

Follow the existing Biome configuration and Conventional Commits described
in `CONTRIBUTING.md`. Keep changes focused and add or update tests for behavior
changes.

## Node version

Use the Node version pinned in `.nvmrc` and `.tool-versions`.
