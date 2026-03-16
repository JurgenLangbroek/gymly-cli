# Gymly CLI + Server

CLI and REST server for managing gym classes at [Vondelgym](https://vondelgym.nl) via the [Gymly](https://gymly.io) platform.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  gymly CLI  │────▶│ gymly-server │────▶│ api.gymly.io │
│  (Node.js)  │     │  (Bun:3000)  │     │  (Gymly API) │
└─────────────┘     └──────────────┘     └──────────────┘
                          │
                    /data/profiles/
                    (Docker volume)
```

- **Server** (`server/`): Bun HTTP server that holds auth tokens in a Docker volume and proxies all Gymly API calls. Supports multiple profiles (accounts).
- **CLI** (`cli/`): Thin Node.js CLI that talks to the server via `GYMLY_API_URL`.
- **Skill** (`skill/`): OpenClaw skill definition for AI assistant integration.

## Quick Start

### 1. Start the server

```bash
docker compose up -d
```

Server runs on `http://localhost:3200`.

### 2. Login

```bash
gymly login <email> <password>
# or with a named profile:
gymly login --profile alice <email> <password>
```

### 3. Use it

```bash
gymly schedule today
gymly schedule tomorrow --week
gymly upcoming
gymly book <courseId> <date>
gymly cancel <courseId> <date>
```

## Multi-Profile Support

```bash
gymly login --profile alice <email> <password>
gymly login --profile bob <email> <password>
gymly profiles                          # list all
gymly schedule today --profile alice   # query as specific profile
```

## CLI Installation

```bash
npm install -g @jurgenlangbroek/gymly-cli
```

Or build locally:

```bash
cd cli && npm install && npm run build
node dist/gymly.js status
```

## Commands

| Command | Description |
|---------|-------------|
| `login <email> <password>` | Login |
| `logout` | Logout |
| `status` | Auth status |
| `me` | Full profile |
| `profiles` | List all profiles |
| `schedule [date] [--week]` | View classes |
| `book <courseId> <date>` | Book a class |
| `cancel <courseId> <date>` | Cancel booking |
| `join-waitlist <courseId> <date>` | Join waitlist |
| `upcoming` | Upcoming bookings |
| `waitlist` | Waitlisted classes |
| `members <courseId> <date>` | Class members |
| `checkin` | Check-in status |
| `notifications` | Notifications |
| `memberships` | Memberships & credits |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `GYMLY_API_URL` | `http://localhost:3200` | Server URL |

## OpenClaw Integration

The server connects to OpenClaw via the `openclaw_shared` Docker network. The CLI is mounted into the OpenClaw container as `/usr/local/bin/gymly`.
