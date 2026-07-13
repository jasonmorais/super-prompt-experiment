# LearnSphere

LearnSphere is a multi-tenant Learning & Development platform for creating, assigning, completing, and measuring structured learning. It supports self-directed learners as well as organizations running onboarding, compliance, certification, and professional-development programs.

The codebase follows the domain-driven architecture of [CellixJS](https://github.com/CellixJs/cellixjs). Business features travel through explicit layers rather than allowing transport or database concerns to leak into the domain.

## Product foundation

Two interconnected vertical slices now form the executable product foundation.

**Learning Content** owns the course catalog and authoring lifecycle:

- tenant ownership and searchable catalog taxonomy;
- draft, review, publication, and archive lifecycle states;
- reusable ordered modules with articles, videos, quizzes, projects, and resources;
- derived duration and lesson counts;
- instructor and learning-administrator permissions enforced by passports and visas;
- GraphQL queries and mutations backed by application services, repositories, units of work, domain adapters, and indexed Mongoose models.

**Learning Delivery** owns each learner's durable record for a published course:

- self-enrollment plus manager, program, and compliance assignments;
- immutable snapshots of required course activities at assignment time;
- due dates and derived overdue state;
- per-activity completion evidence, time spent, assessment score, and attempt count;
- derived course progress and automatic `NOT_STARTED` → `IN_PROGRESS` → `COMPLETED` transitions;
- learner-owned progress updates and administrator waiver rules enforced through request passports.

The learner portal reads these records through authenticated GraphQL. Its dashboard course cards and statistics are live rather than static presentation data.

## Architecture

```text
GraphQL resolver
  -> request-scoped application service
    -> passport-scoped data source
      -> repository + unit of work
        -> Course / LearningRecord aggregate and visa rules
          -> Mongoose domain adapter
            -> Course / LearningRecord model
```

Application code lives under `packages/learnsphere/*`; reusable Cellix seedwork remains under `packages/cellix/*`. `apps/api` is the Azure Functions composition root, `apps/ui-portal` hosts the React portal, and `apps/docs` contains product and architecture documentation.

## Development

```bash
pnpm install
pnpm run build
pnpm run dev
```

The root development command starts the portal (`:3000`), docs (`:3001`), Azure Functions API (`:7071`), OIDC mock (`:1355`), and seeded in-memory Mongo replica set (`:50000`). Sign in as `alex.morgan@example.com` with password `password` to load the seeded Northstar Digital learner dashboard.

See the [domain model](apps/docs/docs/domain-model.md) for current boundaries and planned extension points.
