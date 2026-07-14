# CLAUDE.md

Guidance for coding agents working in this repository. Human setup and
contribution instructions live in `README.md` and `CONTRIBUTING.md`.

## Commands

Run commands from the repository root:

```bash
npm ci
cp packages/backend/.env.example packages/backend/.env
npm run test-db:up
npm run repopulate-db
npm run dev

npm run lint
npm run check:ts
npm run build
npm run test
npm run validate
npm run test-db:down

npm run db-migrate:create -- <migration-name>
npm run db-migrate:up
npm run db-migrate:down
```

Backend tests require the database and fixtures. Frontend tests can run with
`npm run test --workspace=packages/frontend`. To run one Vitest file, execute
`npx vitest run <path>` from the owning workspace.

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

Follow the existing Prettier configuration and Conventional Commits described
in `CONTRIBUTING.md`. Keep changes focused and add or update tests for behavior
changes.

## Node version

Use the Node version pinned in `.nvmrc` and `.tool-versions`.
