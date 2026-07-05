# Sprint 31 — Notification Read Endpoint

## Objective

Implement `PATCH /v1/notifications/:id/read` as specified in `API_SPEC.md`.

## Documentation to Read

1. `API_SPEC.md` L244–L248 — endpoint specification.
2. `DATABASE_DESIGN.md` — notifications table, `read_at` column.
3. `CODING_STANDARDS.md` — TypeScript conventions.
4. `docs/ai/antigravity-playbook.md`

## Scope

**In scope:**
- Implement `PATCH /v1/notifications/:id/read` in `services/api/src/notifications/`.
- Create `notifications.module.ts` and register it in `app.module.ts`.
- Set `readAt` timestamp on the notification record.
- Validate that the notification belongs to the authenticated user's org.
- Unit tests.

**Out of scope:**
- Bulk mark-as-read.
- Push notification delivery.

## Files

- `services/api/src/notifications/notifications.module.ts` — [NEW]
- `services/api/src/notifications/notifications.controller.ts` — add PATCH route
- `services/api/src/notifications/notifications.service.ts` — add read logic
- `services/api/src/notifications/__tests__/notifications.service.spec.ts` — [NEW]
- `services/api/src/app.module.ts` — import NotificationsModule

## Acceptance Criteria

- [ ] `PATCH /v1/notifications/:id/read` sets `readAt` to current timestamp.
- [ ] Notification must belong to the authenticated user's org.
- [ ] Returns `404` if notification not found or not owned by the user.
- [ ] Idempotent — calling twice on an already-read notification succeeds.
- [ ] Unit tests pass.

## Definition of Done

- [ ] Acceptance criteria met and tested.
- [ ] Standard error envelope used.
- [ ] NotificationsModule registered in `app.module.ts`.

## Stop Condition

Stop once the read endpoint is implemented and tested. do not begin the next numbered sprint in this same branch or session.
