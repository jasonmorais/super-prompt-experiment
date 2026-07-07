# Simnova

A **bare-bones application scaffold** built on the [Cellix framework](https://github.com/CellixJs/cellixjs).

Simnova mirrors the structure, package organization, and developer experience of
the reference Cellix application (`OCom`) — but with all business logic removed.
It is the standard starting point for building new Cellix-based applications:
clone it, and start adding your own domain, application services, GraphQL types,
and UI features.

## Layout

```
apps/
  api/                          Azure Functions host — Cellix bootstrap + DI wiring
  ui-portal/                           Single blank UI portal (Vite + React)
  server-mongodb-memory-mock/   Local in-memory MongoDB for development
  server-oauth2-mock/           Local mock OIDC provider for development
  docs/                         Documentation site
packages/
  cellix/                       The Cellix framework (shared infrastructure & seedwork)
  simnova/                      Simnova application-identity packages (the app layers)
iac/                            Azure infrastructure-as-code (Bicep)
```

### Application layers (`packages/simnova/*`)

Every Cellix application is composed of the same layers. In Simnova they ship as
empty shells that preserve the boundaries and wiring but contain no features:

| Package | Responsibility |
| --- | --- |
| `domain` | Domain model, passports, unit-of-work contracts |
| `data-sources-mongoose-models` | Mongoose model factories |
| `persistence` | Data-source factory over the domain + models |
| `application-services` | Request-scoped application services host |
| `context-spec` | The API context type available to the app |
| `event-handler` | Domain event handler registration |
| `graphql` | GraphQL schema + resolvers |
| `graphql-handler` | Azure Functions ↔ Apollo integration |
| `rest` | Azure Functions REST handler |
| `service-*` | Thin application wrappers over Cellix infrastructure services |
| `ui-shared`, `ui-route-root` | Shared UI + the portal's root route |

## Getting started

```bash
pnpm install
pnpm build
```

> The Cellix framework packages under `packages/cellix/*` are vendored with the
> template. Application packages in `packages/simnova/*` depend on them via
> workspace references.
