---
name: gymly
description: Manage gym classes at Vondelgym — view schedule, book/cancel classes, check-in, manage waitlists
homepage: https://github.com/jurgenlangbroek/gymly-cli
metadata: {"openclaw":{"emoji":"💪","requires":{"bins":["gymly"]},"install":[{"id":"npm","kind":"npm","package":"@jurgenlangbroek/gymly-cli","bins":["gymly"],"label":"Install gymly-cli (npm)"}]}}
env:
  GYMLY_API_URL: http://gymly-api:3000
---

# Gymly — Vondelgym Class Manager

You can manage gym classes at Vondelgym using the `gymly` CLI tool. All commands output JSON by default.

## Important: Auth & Approval

- **Before any commands**, run `gymly status`. If not authenticated, the user needs to log in via `gymly login`.
- **Always ask the user before**: booking classes, cancelling bookings, joining waitlists.

## Auth Flow

Check if authenticated:

```bash
gymly status
```

If not authenticated, the user needs to log in:

```bash
gymly login <email> <password>
```

## Multi-Profile Support

Multiple accounts are supported via the `--profile` flag. Each profile has its own login session.

```bash
gymly login --profile alice <email> <password>
gymly login --profile bob <email> <password>
gymly profiles   # list all profiles and their status
```

Use `--profile <name>` on any command to act as that profile:

```bash
gymly schedule today --profile alice
gymly upcoming --profile bob
```

When the user says "check my schedule" → use their default profile. When they reference someone by name → use the appropriate `--profile`.

## All Commands

| Command | Description |
|---------|-------------|
| `gymly status` | Check authentication status |
| `gymly login <email> <password>` | Log in |
| `gymly logout` | Log out |
| `gymly me` | Full user profile |
| `gymly profiles` | List all profiles and auth status |
| `gymly schedule [date]` | Classes for a day (default: today) |
| `gymly schedule [date] --week` | Week view (7 days from date) |
| `gymly book <courseId> <date>` | Book a class |
| `gymly cancel <courseId> <date>` | Cancel a booking |
| `gymly join-waitlist <courseId> <date>` | Join waitlist for a full class |
| `gymly upcoming` | My upcoming bookings |
| `gymly waitlist` | My waitlisted classes |
| `gymly members <courseId> <date>` | Who's signed up for a class |
| `gymly checkin` | Check-in status |
| `gymly notifications` | View notifications |
| `gymly memberships` | View memberships & credits |

## Date Formats

- `today`, `tomorrow`, `yesterday`
- Day names: `monday`, `tuesday`, ..., `sunday` (next occurrence)
- ISO format: `YYYY-MM-DD`

## Tips

- Always check `gymly status` before other commands
- Course IDs come from `gymly schedule` results
- Date args for `book`/`cancel`/`join-waitlist` accept the same formats as `schedule`
- All output is JSON; add `--pretty` for human-readable tables
- When the user asks about "the gym" or "Vondelgym" or "classes", use this skill
