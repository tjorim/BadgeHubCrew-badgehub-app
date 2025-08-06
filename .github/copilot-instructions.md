# BadgeHub API and Frontend

BadgeHub is a monorepo containing a Node.js REST API backend and React frontend for managing badge applications. It supports badge ecosystems like Why2025, MCH2022, and Troopers23, allowing developers to publish and distribute applications for hardware badges.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Node.js Version Requirements
- **CRITICAL**: Requires Node.js 24.4.1 or higher (specified in .nvmrc)
- Current system has Node.js 20.x which lacks --experimental-strip-types flag
- Always install Node.js 24.4.1:
  ```bash
  cd /tmp && wget https://nodejs.org/dist/v24.4.1/node-v24.4.1-linux-x64.tar.xz
  tar -xf node-v24.4.1-linux-x64.tar.xz
  export PATH="/tmp/node-v24.4.1-linux-x64/bin:$PATH"
  ```

### Bootstrap and Build Process
- Install dependencies: `npm ci` -- takes 1.5 minutes. NEVER CANCEL. Set timeout to 3+ minutes.
- TypeScript check: `npm run check:ts` -- takes 11 seconds
- Linting: `npm run lint` -- takes 0.3 seconds
- Build: `npm run build` -- takes 2.2 seconds
- **Complete validation**: `npm run validate` -- takes 19 seconds. NEVER CANCEL. Set timeout to 30+ minutes.

### Database Setup and Testing
- Copy environment: `cp packages/backend/.env.test packages/backend/.env`
- Start test database: `npm run test-db:up --workspace=packages/backend -- --wait` -- takes 8 seconds. NEVER CANCEL. Set timeout to 2+ minutes.
- Populate database: `npm run repopulate-db --workspace=packages/backend` -- takes 15 seconds. NEVER CANCEL. Set timeout to 3+ minutes.
- Run tests: `npm run test` -- takes 9 seconds. NEVER CANCEL. Set timeout to 15+ minutes.

### Development Environment
- Start dev servers: `npm run dev` -- starts both frontend and backend
- Frontend: http://localhost:5173 (Vite development server)
- Backend API: http://localhost:8081 (serves both API and production frontend)
- Database admin: http://localhost:8002 (pgAdmin, password: badgehub)
- API documentation: http://localhost:8081/api-docs/swagger.json

### Production Build
- Uses PM2 for process management
- Backend serves frontend as static files
- Docker containers for deployment

## Validation

### Manual Testing Requirements
- **ALWAYS** test the complete user workflow after making changes
- Test API endpoints: `curl http://localhost:8081/api/v3/ping` should return "pong"
- Test project data: `curl http://localhost:8081/api/v3/project-summaries` returns project list
- **FRONTEND VALIDATION**: Navigate to http://localhost:5173 and verify the BadgeHub interface loads
- Test both development (Vite) and production (backend-served) modes

### Critical Validation Steps
- Always run `npm run validate` before committing - this runs lint, check:ts, build, and test
- Always run through at least one complete end-to-end scenario after making changes
- Test with authentication disabled (DISABLE_AUTH=true in .env)
- Verify database migrations work: `npm run db-migrate:up --workspace=packages/backend`

### CI/CD Validation
- GitHub Actions workflow runs the same validation steps
- Always run `npm run lint` and `npm run check:ts` before committing
- Docker builds use Node.js 24 and multi-stage builds
- Build artifacts are in dist/ directories (excluded from commits)

## Project Structure

### Monorepo Layout
```
packages/
├── backend/     # Node.js API server (Express, TypeScript, PostgreSQL)
├── frontend/    # React app (Vite, TypeScript, TailwindCSS)
└── shared/      # Shared TypeScript types and utilities
```

### Backend (packages/backend/)
- **Framework**: Express.js with ts-rest for type-safe APIs
- **Database**: PostgreSQL with db-migrate for schema management
- **Authentication**: JWT via Keycloak (can be disabled with DISABLE_AUTH=true)
- **Key files**: src/index.ts (entry), src/controllers/ (API routes)
- **Build**: Uses esbuild with --experimental-strip-types
- **Process management**: PM2 in production

### Frontend (packages/frontend/)
- **Framework**: React 19 with React Router
- **Build tool**: Vite 6 with TypeScript
- **Styling**: TailwindCSS 4
- **Testing**: Vitest with React Testing Library
- **Key files**: src/main.tsx (entry), src/pages/ (routes)

## Common Commands

### Development Workflow
```bash
# Start fresh (run these in order)
npm ci                                           # Install dependencies (1.5 min)
cp packages/backend/.env.test packages/backend/.env
npm run test-db:up --workspace=packages/backend -- --wait  # Start DB (8 sec)
npm run repopulate-db --workspace=packages/backend        # Add test data (15 sec)
npm run dev                                     # Start both servers

# Individual commands
npm run dev:frontend                            # Frontend only (Vite)
npm run dev:backend                             # Backend only (Express)
npm run build                                   # Build both (2.2 sec)
npm run test                                    # Run all tests (9 sec)
npm run validate                                # Full CI pipeline (19 sec)
```

### Database Commands
```bash
npm run db-migrate:create --workspace=packages/backend -- migration-name
npm run db-migrate:up --workspace=packages/backend
npm run db-migrate:down --workspace=packages/backend
npm run repopulate-db --workspace=packages/backend
```

### Docker Commands
```bash
# Development (serves both API and frontend)
docker compose up --detach
docker compose down

# Production
docker compose --file docker-compose.production.yml up --detach
docker compose --file docker-compose.production.yml down

# Test database only
npm run test-db:up --workspace=packages/backend
npm run test-db:down --workspace=packages/backend
```

## Critical Timing and Timeout Information

**NEVER CANCEL long-running commands**. Build and test processes require adequate time:

- `npm ci`: 1.5 minutes (set timeout: 180+ seconds)
- `npm run validate`: 19 seconds (set timeout: 1800+ seconds for safety)
- `npm run test`: 9 seconds (set timeout: 900+ seconds)
- Database startup: 8 seconds (set timeout: 120+ seconds)
- Database population: 15 seconds (set timeout: 180+ seconds)
- Docker image pulls: Variable (set timeout: 600+ seconds)

## Troubleshooting

### Common Issues
- **Node.js version errors**: Install Node.js 24.4.1 as shown above
- **Build failures**: Check Node.js version and run `npm ci` again
- **Database connection**: Ensure Docker is running and test-db containers are up
- **Port conflicts**: Backend (8081), Frontend (5173), Database (5432), pgAdmin (8002)
- **Permission errors**: Check file permissions and Docker daemon status

### Environment Variables
- Copy `.env.test` to `.env` for development
- `DISABLE_AUTH=true` disables Keycloak authentication for testing
- `NODE_ENV=production` switches to production mode
- See `.env.example` files for complete configuration options

## Key Technologies
- **Backend**: Node.js 24+, Express, TypeScript, PostgreSQL, ts-rest, Zod, PM2
- **Frontend**: React 19, Vite 6, TypeScript, TailwindCSS 4, React Router 7
- **Database**: PostgreSQL with db-migrate
- **Testing**: Vitest, React Testing Library, Supertest
- **Build**: esbuild, Vite
- **Deployment**: Docker, Docker Compose, GitHub Actions