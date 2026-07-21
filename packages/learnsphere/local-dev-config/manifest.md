# manifest.md - @learnsphere/local-dev-config

## Purpose

Provide LearnSphere local-development URL and hostname policy as a reusable package, while delegating generic local-development mechanics to `@cellix/local-dev`.

## Scope

This package resolves LearnSphere hostnames from app `.env` files and environment overrides, applies the shared hostname suffixing helper from `@cellix/local-dev`, and builds the complete local URL set needed by UI, API, mock-auth, docs, and other build-time consumers.

## Non-goals

- Generic process runners, port math, JSON syncing, or dotenv parsing
- Production runtime configuration
- Non-LearnSphere app defaults
- Generic local dev process orchestration

## Public API shape

Published entrypoints:

- `@learnsphere/local-dev-config`
- `@learnsphere/local-dev-config/hostnames`
- `@learnsphere/local-dev-config/urls`

Root entrypoint exports:

- `getLearnSphereHostnames(options?)`
- `buildLearnSphereUrls(options?)`
- `buildLearnSphereApiLocalSettings(options?)`
- `LearnSphereLocalDevOptions`
- `LearnSphereHostnames`
- `LearnSphereUrls`

## Core concepts

- LearnSphere app wrappers should use this package to get LearnSphere URL values, then pass those values into generic `@cellix/local-dev` worktree-aware runners or settings syncers.
- Environment values override app `.env` file values so task runners can inject per-process configuration.
- Worktree suffixing, Mongo ports, Azurite ports, and settings-file connection-string transforms are delegated to `@cellix/local-dev` so all participating apps share one rule.

## Package boundaries

- App-specific auth paths and redirect paths are allowed here because they are LearnSphere local-dev policy.
- Generic local-development primitives must not be reimplemented here.
- One-off behavior for a single app should stay in that app's wrapper script unless at least two LearnSphere consumers need the same policy.

## Dependencies / relationships

- Depends on `@cellix/local-dev`
- Downstream consumers in this repo: `@apps/api`, `@apps/ui-portal`, `@apps/ui-staff`, and `@apps/server-oauth2-mock`

## Testing strategy

- Test through the package entrypoint.
- Prove hostnames are derived from fixture app `.env` files, environment overrides take precedence, worktree suffixes are applied safely without duplication, and the full URL contract remains stable.

## Documentation obligations

- Keep `README.md` consumer-facing and focused on app-wrapper usage.
- Keep this manifest aligned with the exported package contract and LearnSphere-specific boundaries.
- Maintain TSDoc on exported helpers and public option/result types.

## Release-readiness standards

- Package build and tests must pass.
- The public surface should remain small and policy-focused.
- Any expansion of exported URL fields should be justified by a real app-wrapper consumer.
