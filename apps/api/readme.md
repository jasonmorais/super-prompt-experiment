# @apps/api

The Azure Functions host for Simnova. It is the composition root that wires the
application together using the Cellix bootstrap (`src/cellix.ts`):

1. **Register infrastructure services** — Mongo, blob + queue storage, token
   validation, and Apollo Server.
2. **Build the context** — assemble the `ApiContextSpec` from the started
   services and register domain event handlers.
3. **Initialize application services** — the request-scoped services host.
4. **Register HTTP handlers** — `graphql`, `rest`, and a `health` endpoint.
5. **Start up** — hand control to Azure Functions.

Service configuration lives under `src/service-config/*`. There is no business
logic here — add handlers and services as your application grows.
