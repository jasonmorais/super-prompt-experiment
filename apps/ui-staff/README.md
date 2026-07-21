# LearnSphere staff portal

The staff portal is a separate Vite and React application for managers and learning administrators. It uses its own Cellix mock-OIDC registration and signing key, protected role-aware routes, Apollo client, and focused `@learnsphere/ui-staff-route-root` feature package.

The team workspace reports learner progress by team, assignment, completion, tracked effort, and overdue status. The course workspace supports the complete initial authoring workflow: create a draft, add module and activity content, submit for review, and publish to the learner catalog. Managers can then assign published training to an existing learner.

```bash
pnpm --filter @apps/ui-staff dev
```

Local sign-in uses `maya.chen@example.com` with password `password`. For the fully connected stack, run `pnpm run dev` from the repository root and open `http://localhost:3002`.
