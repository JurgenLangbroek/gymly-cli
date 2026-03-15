#!/usr/bin/env node

import { setProfile } from "./client.js";
import * as auth from "./commands/auth.js";
import * as scheduleCmd from "./commands/schedule.js";
import * as bookCmd from "./commands/book.js";
import * as upcomingCmd from "./commands/upcoming.js";
import * as checkinCmd from "./commands/checkin.js";
import * as notificationsCmd from "./commands/notifications.js";
import * as membershipsCmd from "./commands/memberships.js";

const rawArgs = process.argv.slice(2);

// Extract --profile <name> before command routing
let profileName = "default";
const args: string[] = [];
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === "--profile" && rawArgs[i + 1]) {
    profileName = rawArgs[i + 1];
    i++; // skip value
  } else {
    args.push(rawArgs[i]);
  }
}
setProfile(profileName);

const command = args[0];
const pretty = args.includes("--pretty");
const cleanArgs = args.filter((a) => a !== "--pretty");

function output(data: unknown) {
  if (pretty) {
    if (Array.isArray(data)) {
      printTable(data);
    } else if (typeof data === "object" && data !== null) {
      for (const [key, value] of Object.entries(data)) {
        console.log(`${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`);
      }
    } else {
      console.log(data);
    }
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

function printTable(items: Record<string, unknown>[]) {
  if (items.length === 0) {
    console.log("(empty)");
    return;
  }
  const keys = Object.keys(items[0]).slice(0, 8);
  const widths = keys.map((k) =>
    Math.max(k.length, ...items.map((item) => String(item[k] ?? "").slice(0, 40).length))
  );
  console.log(keys.map((k, i) => k.padEnd(widths[i])).join("  "));
  console.log(widths.map((w) => "-".repeat(w)).join("  "));
  for (const item of items) {
    console.log(keys.map((k, i) => String(item[k] ?? "").slice(0, 40).padEnd(widths[i])).join("  "));
  }
}

function usage(): never {
  console.log(`Usage: gymly <command> [args] [--profile <name>] [--pretty]

Auth:
  login <email> <password>      Login and store token
  logout                        Remove stored token
  status                        Check auth status
  me                            Full profile
  profiles                      List all profiles

Schedule:
  schedule [date]               Classes for a day (default: today)
  schedule [date] --week        Week view (7 days from date)

Bookings:
  book <courseId> <date>         Book a class
  cancel <courseId> <date>       Cancel a booking
  join-waitlist <courseId> <date> Join waitlist for a full class
  upcoming                      My upcoming bookings
  waitlist                      My waitlisted classes
  members <courseId> <date>     Who's signed up for a class

Check-in:
  checkin                       Check-in status

Other:
  notifications                 View notifications
  memberships                   View memberships & credits

Dates: YYYY-MM-DD, today, tomorrow, monday..sunday
Profiles: --profile <name> (default: "default")`);
  process.exit(1);
}

async function run() {
  if (!command || command === "help" || command === "--help") usage();

  switch (command) {
    case "login": {
      const email = cleanArgs[1];
      const password = cleanArgs[2];
      if (!email || !password) { console.error("Usage: gymly login <email> <password>"); process.exit(1); }
      return output(await auth.login(email, password));
    }
    case "logout":
      return output(await auth.logout());
    case "status":
      return output(await auth.status());
    case "me":
      return output(await auth.me());
    case "profiles":
      return output(await auth.profiles());
    case "schedule": {
      const week = cleanArgs.includes("--week");
      const dateArg = cleanArgs.slice(1).find((a) => !a.startsWith("--"));
      return output(await scheduleCmd.schedule(dateArg, week));
    }
    case "book": {
      const courseId = cleanArgs[1];
      const date = cleanArgs[2];
      if (!courseId || !date) { console.error("Usage: gymly book <courseId> <date>"); process.exit(1); }
      return output(await bookCmd.book(courseId, date));
    }
    case "cancel": {
      const courseId = cleanArgs[1];
      const date = cleanArgs[2];
      if (!courseId || !date) { console.error("Usage: gymly cancel <courseId> <date>"); process.exit(1); }
      return output(await bookCmd.cancel(courseId, date));
    }
    case "join-waitlist": {
      const courseId = cleanArgs[1];
      const date = cleanArgs[2];
      if (!courseId || !date) { console.error("Usage: gymly join-waitlist <courseId> <date>"); process.exit(1); }
      return output(await bookCmd.joinWaitlist(courseId, date));
    }
    case "upcoming":
      return output(await upcomingCmd.upcoming());
    case "waitlist":
      return output(await upcomingCmd.waitlist());
    case "members": {
      const courseId = cleanArgs[1];
      const date = cleanArgs[2];
      if (!courseId || !date) { console.error("Usage: gymly members <courseId> <date>"); process.exit(1); }
      return output(await upcomingCmd.members(courseId, date));
    }
    case "checkin":
      return output(await checkinCmd.checkin());
    case "notifications":
      return output(await notificationsCmd.notifications());
    case "memberships":
      return output(await membershipsCmd.memberships());
    default:
      console.error(`Unknown command: ${command}`);
      usage();
  }
}

run().catch((err) => {
  console.error(JSON.stringify({ error: err.message }));
  process.exit(1);
});
