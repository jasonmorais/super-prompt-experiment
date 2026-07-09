# AXC Application Packages

These packages are the AgentCourses application layers. Future product work
should stay inside this package family plus `apps/api`, `apps/docs`, and
`packages/axc-verification`.

Expected feature homes:

| Package | Future task responsibility |
| --- | --- |
| `domain` | Domain types and business rules |
| `application-services` | Application use cases |
| `rest` | HTTP request parsing, response mapping, and REST route orchestration |
| `persistence` | Repository contracts and in-memory or data-source factories |
| `service-mongoose` | Mongo/Mongoose adapter wiring if a task chooses persisted storage |
