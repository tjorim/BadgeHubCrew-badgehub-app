[<img src="assets/badgehub-logo.svg" align="right" alt="BadgeHub logo" width="200">](#readme)

# BadgeHub App

BadgeHub is a monorepo containing a Node.js REST API and a React frontend. The
frontend, backend, and shared ts-rest contracts live in pnpm workspaces.

## Prerequisites

- Node.js 24.4.1 (see `.nvmrc`; `.tool-versions` may select a newer Node 24 release)
- Corepack and pnpm
- Docker with Docker Compose
- A Keycloak realm and public OpenID Connect client for authenticated flows

## Quick start

Enable pnpm, install dependencies, and create the backend environment file:

```bash
corepack enable
pnpm install --frozen-lockfile
cp packages/backend/.env.example packages/backend/.env
```

Review `packages/backend/.env`, then start and seed the test database:

```bash
pnpm run test-db:up
pnpm run repopulate-db
```

Start the frontend and backend together:

```bash
pnpm run dev
```

Open <http://localhost:8081>. Vite listens on port 5173, but it only supplies
development assets; the backend serves the HTML application and API on port 8081.

Stop the test database when finished:

```bash
pnpm run test-db:down
```

### Using another PostgreSQL port

The test database binds only to localhost. If port 5432 is occupied, change
`POSTGRES_PORT` in `packages/backend/.env` before running `pnpm run test-db:up`.
The backend and Docker Compose use the same value.

## Authentication

Anonymous catalog browsing does not require an account. Creating and editing
projects requires a user in the Keycloak realm configured by these backend
environment variables:

```dotenv
KEYCLOAK_BASE_URL=https://your-keycloak.example
KEYCLOAK_REALM=your-realm
KEYCLOAK_CLIENT_ID=your-public-client
```

The client must enable the standard authorization-code flow, allow the local
BadgeHub URL as a redirect URI and web origin, and use PKCE. BadgeHub does not
ship with a default username or password. Ask the project maintainers for
access to a shared development realm, or configure your own Keycloak instance.
Infrastructure examples live under `infra/keycloak/`; production infrastructure
is maintained separately in the
[badgehub-infra repository](https://github.com/BadgeHubCrew/badgehub-infra/tree/main/docs).

## Test data

`pnpm run repopulate-db` runs migrations and then **deletes and recreates** the
BadgeHub fixture records. Do not point it at a database containing data you
want to keep.

Fixture projects use synthetic owner identifiers by default. To make every
fixture project editable by your development account, set `DEV_USER_SUB` in
`packages/backend/.env` to the `sub` claim from that user's Keycloak token
before repopulating the database.

## Testing and validation

Backend tests require the test database and fixtures:

```bash
pnpm run test-db:up
pnpm run repopulate-db
pnpm run test
```

Frontend tests can run independently:

```bash
pnpm --filter frontend test
```

Run all repository checks before opening a pull request:

```bash
pnpm run validate
```

The individual checks are `pnpm run lint`, `pnpm run check:ts`,
`pnpm run build`, and `pnpm run test`.

## Database migrations

Migration files live in `packages/backend/migrations/`. Use the root commands:

```bash
pnpm run db-migrate:create -- <migration-name>
pnpm run db-migrate:up
pnpm run db-migrate:down
```

Fill in both generated SQL files and verify the up and down directions. The
application automatically runs pending up migrations during startup.

## Production container

The repository includes a standalone Compose example:

```bash
cd infra/badgehub
cp .env.prod.example .env.prod
# Replace CHANGE_ME and review every public URL and Keycloak value.
docker compose --env-file .env.prod up -d --build --wait
```

The application is available on `EXPOSED_PORT` (9001 by default). The image
build compiles all workspaces, and the backend serves the built frontend. Stop
the example stack with:

```bash
docker compose --env-file .env.prod down
```

For a complete production environment with TLS, backups, monitoring, and
Keycloak, use infrastructure appropriate to your deployment rather than
treating this example as a full operations stack.

## Main technologies

- React, Vite, Tailwind CSS, and DaisyUI
- Express and PostgreSQL
- ts-rest and Zod for shared API contracts
- db-migrate for database migrations
- Keycloak and JWT authentication
- PM2 for the production Node.js process

See [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes.
