# AgentCourses

A **bare-bones application scaffold** built on the [Cellix framework](https://github.com/CellixJs/cellixjs).

AgentCourses is prepared as a non-production harness evaluation app. The base
repo keeps the Cellix package organization and developer workflow while leaving
the product domain unimplemented so future task branches can be compared from
the same starting point.

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
  axc/                          AgentCourses application packages (project code: axc)
  axc-verification/             Acceptance and architecture-test package placeholders
iac/                            Azure infrastructure-as-code (Bicep)
```

### Application layers (`packages/axc/*`)

Every Cellix application is composed of the same layers. In AgentCourses they ship as
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

### Feature readiness

Future feature implementations should be able to work inside these existing
boundaries:

| Boundary | Purpose |
| --- | --- |
| `apps/api/**` | Azure Functions composition and HTTP handler registration |
| `packages/axc/rest/**` | REST route parsing and response mapping |
| `packages/axc/application-services/**` | Application use cases |
| `packages/axc/domain/**` | Domain model and rules |
| `packages/axc/persistence/**` | Repository contracts and data-source factories |
| `packages/axc/service-mongoose/**` | Mongo/Mongoose adapter wiring if needed |
| `packages/axc-verification/**` | Acceptance and architecture verification |
| `apps/docs/**` | API docs, MADRs, and product documentation |

The base REST handler is mounted at the Azure Functions catch-all route, so
future endpoints can be added in `packages/axc/rest/src/routes` without
additional app-level route work.

The health endpoint is already available at `/api/health` with this contract:

```json
{
  "status": "ok",
  "service": "agentCourses-api",
  "projectCode": "axc",
  "environment": "local",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Getting started

```bash
pnpm install
pnpm build
pnpm test
pnpm run verify
```

> The Cellix framework packages under `packages/cellix/*` are vendored with the
> template. Application packages in `packages/axc/*` depend on them via
> workspace references.
