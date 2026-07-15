# Contributing to BadgeHub

## Fork and branch setup

Clone your fork and add the official repository as `upstream`:

```bash
git clone https://github.com/<your-user>/badgehub-app.git
cd badgehub-app
git remote add upstream https://github.com/BadgeHubCrew/badgehub-app.git
git fetch upstream
```

Create each change from current upstream `main`:

```bash
git switch -c <type>/<short-description> upstream/main
```

Keep unrelated changes in separate branches and pull requests. Do not commit
dotenv files, credentials, generated build output, coverage, or `node_modules`.

## Development workflow

Follow the [README](README.md) to install dependencies, configure the backend,
start PostgreSQL, and run the application. Use Node.js 24 and the pnpm version
declared in `package.json`.

Changes to shared API contracts belong in `packages/shared`; update both the
frontend and backend consumers in the same pull request. Database schema
changes require a new migration with tested up and down SQL.

Before pushing, run:

```bash
pnpm run validate
```

If a check cannot run in your environment, explain that clearly in the pull
request instead of presenting it as passing.

## Pull requests

In the pull request description:

- explain the problem and the chosen approach;
- list behavior or interface changes;
- state which checks were run;
- include screenshots for visible frontend changes;
- call out migrations, environment variables, or deployment considerations.

Prefer focused pull requests that are easy to review. Update documentation and
tests whenever behavior or contributor setup changes.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
Common types are:

- `build`: build system or dependency changes
- `ci`: continuous-integration changes
- `docs`: documentation only
- `feat`: new behavior
- `fix`: bug fixes
- `perf`: performance improvements
- `refactor`: code changes without behavior changes
- `style`: formatting-only changes
- `test`: test additions or corrections
- `devex`: development-experience changes
- `clean`: removal of unused code or files
- `chore`: routine maintenance

Use an imperative, concise subject, for example:

```text
fix: preserve uploaded binary MIME types
devex: document local Keycloak setup
```
