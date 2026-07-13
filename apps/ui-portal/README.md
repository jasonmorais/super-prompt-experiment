# LearnSphere learner portal

The Vite and React portal provides the learner-facing LearnSphere experience. It includes OIDC authentication, Apollo connectivity, responsive navigation, active-course progress, scheduled learning, achievements, certificates, streaks, and professional growth goals.

```bash
pnpm --filter @apps/ui-portal dev
```

Feature views belong in focused `@learnsphere/ui-*` packages; this app remains the routing, authentication, and client composition boundary.
