# LearnSphere learner portal

The Vite and React portal provides the learner-facing LearnSphere experience. It includes a public sign-in route, mock-compatible OIDC authorization-code authentication, protected learner routes, Apollo connectivity, organization-scoped learning records, progress summaries, learning history, and a published course catalog with self-enrollment.

Identity displayed in the authenticated shell comes only from OIDC claims. Dashboard metrics and course cards are calculated from the `myLearning` GraphQL query, while catalog enrollment calls the `selfEnroll` mutation and refetches the learner record.

```bash
pnpm --filter @apps/ui-portal dev
```

Feature views belong in focused `@learnsphere/ui-*` packages; this app remains the routing, authentication, and client composition boundary.
