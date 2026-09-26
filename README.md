# railway-boilerplate

Minimal Express server, deployed on Railway from GitHub.

## Routes

| Route     | Response                            |
| --------- | ----------------------------------- |
| `/`       | `Hello World`                       |
| `/health` | `{"status":"ok","uptime":<number>}` |

## Local development

```bash
npm install
npm run dev     # node --watch, restarts on file change
```

Runs on http://localhost:3000 (override with `PORT`).

## Deploying

Railway auto-deploys every push to `main`. Build and runtime settings live in
`railway.json`:

- **Builder** — Nixpacks (detects Node from `package.json`, runs `npm ci`)
- **Start command** — `npm start`
- **Healthcheck** — `/health`, 60s timeout. A deploy isn't swapped in until
  this returns 200.

## Railway notes

Two things that break Node deploys on Railway, both already handled in
`src/server.js`:

1. **Read `process.env.PORT`.** Railway assigns the port at runtime; a
   hardcoded port means the healthcheck never connects.
2. **Bind to `0.0.0.0`, not `localhost`.** Railway's proxy can't reach a
   container listening only on the loopback interface.

Don't set `PORT` as a Railway variable — Railway injects it, and overriding it
shadows the real value.

## Adding environment variables

Add them in Railway under **Variables**, then read with `process.env.NAME`.
Mirror the key (not the value) into `.env.example` so the required set stays
documented. Changing a variable triggers a redeploy.
