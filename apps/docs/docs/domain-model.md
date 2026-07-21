---
sidebar_position: 2
---

# Domain model

LearnSphere is organized around bounded contexts so that learning workflows can grow without turning course content, learner state, and organizational policy into one oversized model.

## Implemented: Learning Content

`Course` is the aggregate root. It owns its catalog metadata and an ordered curriculum of reusable module definitions. Each module contains learning activities typed as article, video, quiz, practical project, or supporting resource.

The aggregate enforces the main authoring invariants:

- only content managers can edit curriculum and taxonomy;
- module keys are unique within a course;
- every module contains at least one valid learning activity;
- only drafts with activities can enter review;
- only learning administrators can publish reviewed courses;
- published and archived course structure is immutable;
- duration and lesson count are derived, never independently stored.

## Implemented: Learning Delivery

`LearningRecord` is the aggregate root for a learner's relationship with one published course. It is intentionally separate from `Course`: authoring can evolve without rewriting historical learner evidence, while a record snapshots the required activity keys and course display metadata that applied when the learning was assigned.

The aggregate distinguishes self-enrollment from manager, program, and compliance assignments. It records activity attempts with completion timestamps, time spent, optional assessment scores, and attempt counters. Status, completion percentage, completion timestamps, and overdue state are derived from that evidence and the assignment due date.

Its authorization rules are subject-aware:

- learners can read and update only records issued to their token subject;
- managers and learning administrators can assign published learning;
- only learning administrators can waive a learning requirement;
- GraphQL never supplies a passport directly—the request-scoped data-source factory carries it through the unit of work and repository into the aggregate.

The current GraphQL surface supports catalog queries, course lifecycle mutations, `myLearning`, self-enrollment, assignment, activity completion, and waivers. The seeded local tenant exercises the relationship between published course curriculum and learner progress.

## Planned boundaries

| Context | Aggregate candidates | Key responsibilities |
| --- | --- | --- |
| Organizations | Organization, Team, Membership, Role | Tenant isolation, departments, permissions, settings |
| Program Delivery | LearningPath, ProgramAssignment, Cohort | Multi-course sequencing, cohorts, prerequisites |
| Assessment | Assessment, Submission, Rubric | Question banks, grading, project review, retakes |
| Credentials | Certification, CredentialAward | Expiry, renewal, evidence, verification |
| Capability | CompetencyFramework, DevelopmentGoal | Skills, proficiency, role expectations, growth plans |
| Engagement | Notification, Achievement | Reminders, streaks, badges, configurable channels |
| Insights | ReportDefinition, MetricSnapshot | Completion, compliance, effectiveness, trend reporting |

References between contexts should use stable entity identifiers. Transactional invariants remain inside one aggregate; cross-context workflows are coordinated through application services and integration events.

## Vertical-slice convention

Any new API capability must be implemented across the entire CellixJS path: schema and resolver, request-scoped application service, read repository or unit of work, domain aggregate and visa, domain adapter, and Mongoose model. This keeps authorization and business rules out of GraphQL and persistence code.
