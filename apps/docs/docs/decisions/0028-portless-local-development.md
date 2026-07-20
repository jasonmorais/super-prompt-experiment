---
sidebar_position: 28
sidebar_label: 0028 Portless Local Development
description: "Adopt portless for HTTPS local development with stable learnsphere.localhost domains and explicit app-level dev targets."
status: accepted
---

# Adopt Portless For Local Development

## Context and Problem Statement

LearnSphere local development previously ran on fixed localhost ports, with browser-facing configuration depending on values such as `3000`, `3002`, `7071`, and `3001`. That model works, but it creates drift between public URLs, local authentication configuration, and app startup ownership, and it makes running more than one worktree at a time painful.

This ADR documents the decision to adopt `portless` as the standard local HTTP entry point for browser-facing applications and supporting HTTP mock services in this monorepo, matching the pattern established upstream in [CellixJS](https://github.com/CellixJs/cellixjs).

## Decision

Adopt `portless` for browser-facing applications and HTTP mock services, with dedicated app-level dev orchestration through `@cellix/local-dev` and `@learnsphere/local-dev-config`:

- portless manages the public local HTTPS route for each app
- each app's `dev` script wraps its normal dev command with `pnpm exec portless <hostname> --force <command>`
- non-HTTP dependencies (the MongoDB memory replica set) keep an internal fixed port
- worktree-scoped variants (`dev:worktree`) get their own hostnames and ports so multiple git worktrees can run side by side without colliding

### Local hostnames

- Portal (end-user) UI: `learnsphere.localhost`
- Staff UI: `staff.learnsphere.localhost`
- API (Azure Functions): `data-access.learnsphere.localhost`
- Mock OIDC server: `mock-auth.learnsphere.localhost`
- Docs: `docs.learnsphere.localhost`

This repo uses the non-privileged port `1355` for all of the above (e.g. `https://learnsphere.localhost:1355`), so every local URL is fully qualified with `:1355`.

Worktree runs suffix the hostname with a sanitized worktree label, e.g. `learnsphere.jason-feature.localhost:1355`, and shift MongoDB/Azurite ports deterministically — see `@cellix/local-dev`'s worktree helpers.

### Package split

- **`@cellix/local-dev`** — generic, policy-free local-dev mechanics: workspace-root discovery, dotenv/JSON helpers, worktree-aware port math, portless URL helpers, and dev runners for Vite, Docusaurus, Azure Functions, Node, and Azurite.
- **`@learnsphere/local-dev-config`** — LearnSphere-specific policy built on top: which app `.env` files define hostnames, which OIDC paths are used, and the full local URL set consumed by app wrapper scripts (`start-dev.ts`).

## Developer Notes

### TLS Trust & Development Setup

To establish HTTPS trust for portless-developed custom domains, run the repository-local trust command once per machine:

```bash
pnpm exec portless trust
```

This configures your machine to trust the development CA and avoids an interactive prompt when starting the dev environment. Re-running the command is idempotent.

- macOS: the Keychain may prompt for permission to modify trusted certificates.
- Windows: UAC may prompt for administrator approval to add the CA to the system certificate store.
- Linux: behavior varies by distribution; some distros require `sudo` or manual placement of the CA into `/usr/local/share/ca-certificates/` followed by `sudo update-ca-certificates`.

Because this repo uses the explicit non-privileged `:1355` origins, the `portless trust` step is optional for HTTPS access to those origins, but still recommended to avoid browser warnings.

### Starting and stopping the proxy

```bash
# stop a running portless proxy (port-agnostic)
pnpm exec portless proxy stop || true

# start the repository-recommended non-privileged proxy mode
pnpm exec portless proxy start --https -p 1355
```

The root `dev` script runs these for you:

```bash
pnpm run dev
```

When restarting after a proxy/network configuration change, use `--force`:

```bash
pnpm run dev -- --force
```

### Running a worktree-isolated dev environment

```bash
pnpm run dev:worktree
```

This derives `WORKTREE_NAME` from the current directory name, suffixes every hostname, and shifts MongoDB/Azurite ports so the worktree can run alongside the primary checkout.

Security:

- The CA created by portless is for development only. Do not reuse or export the private key for production.
