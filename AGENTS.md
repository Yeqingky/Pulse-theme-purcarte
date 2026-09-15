# Pulse-theme-purcarte

## Repository responsibility

This repository contains the static PurCarte monitoring theme adapted for Pulse. It consumes Pulse Server-Sent Events in the browser and renders the home dashboard without server-side storage or administration.

## Code navigation

- `src/services/pulse.ts`: Pulse SSE connection, parsing, reconnect handling, and data conversion.
- `src/types/pulse.ts`: Pulse payload and dashboard data types.
- `src/contexts/NodeDataContext.tsx`: Node snapshot state.
- `src/contexts/LiveDataContext.tsx`: Live status state.
- `src/hooks/useNodeListCommons.ts`: Search, tag filtering, sorting, and aggregate statistics.
- `src/components/sections/`: Header, footer, statistics, tags, and node views.
- `src/config/`: Build-time `VITE_*` configuration and localized text.
- `src/main.tsx` and `src/pages/Home.tsx`: Application composition and the home page.

## Development and validation

```bash
yarn install
yarn dev
yarn lint
yarn build
```

The production build output is `dist`. Copy `.env.example` to `.env` for local configuration. Cloudflare Pages uses `yarn build` and publishes `dist`.

## Version control and release

- Preserve the upstream commit history and author attribution.
- Do not rewrite history or force-push unless explicitly requested.
- Verify `yarn lint` and `yarn build` before release.
- Configure production `VITE_*` variables in the deployment environment, not by committing secrets.

## Business rules

- The SSE endpoint sends `update` events whose `systems` array is the complete current snapshot.
- A node is identified by `systems[].id`; its `tags` array drives the home-page tag filter.
- `alert: true` is treated as offline. Missing live status is also displayed as offline.
- Pulse resource strings are converted to bytes before formatting. Network speed values are received in MB/s and converted consistently for the UI.
- The dashboard has only the home page. Do not reintroduce instance detail routes, administration, WebSocket, JSON-RPC, or server configuration writes.
