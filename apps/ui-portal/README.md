# @apps/ui

The single blank UI portal for Simnova — a Vite + React application shell.

It wires the framework essentials every portal needs:

- **antd** `ConfigProvider` for theming
- **react-router-dom** `BrowserRouter` for routing
- **react-oidc-context** `AuthProvider` for authentication (against
  `@apps/server-oauth2-mock` in local development)
- an **Apollo** client connected to the Simnova GraphQL API

The landing page (`@simnova/ui-route-root`) is intentionally blank. Build your
features by adding routes here and components to `packages/simnova/ui-*`.
