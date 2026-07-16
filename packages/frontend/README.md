# BadgeHub frontend

The BadgeHub frontend is a React application built with Vite, Tailwind CSS,
and DaisyUI. It consumes the shared ts-rest contracts from `packages/shared`.

Run commands from the repository root unless noted otherwise:

```bash
pnpm run dev
pnpm --filter frontend build
pnpm --filter frontend check:ts
pnpm --filter frontend test
```

During development, Vite listens on port 5173 and serves assets referenced by
`index-indirect-dev.html`. Open <http://localhost:8081>, not the Vite port: the
backend injects runtime configuration and serves the application shell.

Frontend authentication is initialized by `SessionProvider` using the public
Keycloak settings injected by the backend. Do not put client secrets or other
private values in frontend environment variables or source files.

Tailwind CSS is integrated through `@tailwindcss/vite`; do not add CDN copies
of Tailwind or DaisyUI to the HTML templates.

See the root [README](../../README.md) and
[CONTRIBUTING guide](../../CONTRIBUTING.md) for complete setup and contribution
instructions.
