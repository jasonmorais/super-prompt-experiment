---
sidebar_position: 1
slug: /
---

# AgentCourses

Welcome to the AgentCourses documentation site.

AgentCourses is a **bare-bones application scaffold** built on the
[Cellix framework](https://github.com/CellixJs/cellixjs). It mirrors the
structure and developer experience of the reference Cellix application with all
business logic stripped out — the standard starting point for building a new
Cellix-based application.

## Where to start

- **Backend** — `apps/api` is the Azure Functions host and composition root.
- **Frontend** — `apps/ui-portal` is the single blank portal.
- **Application layers** — `packages/axc/*` hold the domain, application
  services, persistence, GraphQL, and UI packages you will extend.
- **Verification** — `packages/axc-verification/*` is reserved for
  acceptance and architecture tests.
- **Framework** — `packages/cellix/*` is the vendored Cellix framework.

Add your architectural decision records, portal guides, and technical overviews
under `apps/docs/docs`.
