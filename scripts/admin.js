#!/usr/bin/env node
/**
 * Local account maintenance: list users, change a role, reset a password.
 *
 * This replaces the deleted `/api/seed` endpoint. It is deliberately a CLI
 * script and NOT an HTTP route: it runs only for someone who already has the
 * database credentials and a shell on the machine, so it adds no remotely
 * reachable privilege path. Do not port any of this into `src/app/api/` — an
 * endpoint that grants admin was the original privilege-escalation defect.
 *
 * Plain CommonJS on purpose, so it runs with bare `node`. mongoose, bcryptjs
 * and dotenv are already dependencies; nothing extra to install.
 *
 * Usage:
 *   node scripts/admin.js list
 *   node scripts/admin.js set-role <email> <user|admin>
 *   node scripts/admin.js reset-password <email> [newPassword]
 *
 * Reads MONGODB_URI from .env.local (or the environment).
 */

const path = require("path");
const readline = require("readline");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env.local"),
  quiet: true,
});

const BCRYPT_COST = 12; // must match src/app/api/(auth)/signup/route.ts
const ROLES = ["user", "admin"]; // the model's enum; see models/user.ts
const CONNECT_TIMEOUT_MS = 8000;

const USAGE = `
  node scripts/admin.js list
  node scripts/admin.js set-role <email> <user|admin>
  node scripts/admin.js reset-password <email> [newPassword]
`;

// Minimal schema: this script only touches these fields, and declaring them
// here avoids importing the TypeScript model from plain node. `strict: false`
// so an existing document is never stripped of fields absent from this shape.
const User = mongoose.model(
  "User",
  new mongoose.Schema({}, { strict: false, collection: "users" })
);

class UsageError extends Error {}

function ask(question, { silent = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    if (silent) {
      // Suppress echo so a typed password does not land in the terminal or
      // scrollback.
      rl._writeToOutput = (s) => {
        if (s.includes("\n")) rl.output.write("\n");
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function findUser(email) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error(
      `no user with email ${email} — run "node scripts/admin.js list" to see who exists`
    );
  }
  return user;
}

/**
 * Argument validation is separated from execution, and runs BEFORE any database
 * connection, so a usage mistake fails instantly instead of waiting on a
 * connection that a usage error never needed.
 */
const COMMANDS = {
  list: {
    validate: () => ({}),
    async run() {
      const users = await User.find({})
        .select("name email role createdAt")
        .sort({ createdAt: 1 })
        .lean();

      if (users.length === 0) {
        console.log("\n  No users exist. Create one at /signup, then re-run.\n");
        return;
      }

      console.log(`\n  ${users.length} user(s):\n`);
      for (const u of users) {
        const role = u.role === "admin" ? "ADMIN" : "user ";
        console.log(`    [${role}] ${u.email}  (${u.name || "no name"})`);
      }
      console.log("");
    },
  },

  "set-role": {
    validate([email, role]) {
      if (!email || !role) {
        throw new UsageError("usage: set-role <email> <user|admin>");
      }
      if (!ROLES.includes(role)) {
        throw new UsageError(
          `role must be one of ${ROLES.join(", ")} — the model allows no others`
        );
      }
      return { email, role };
    },
    async run({ email, role }) {
      const user = await findUser(email);

      if (user.role === role) {
        console.log(`\n  ${email} is already ${role}. Nothing to do.\n`);
        return;
      }

      const previous = user.role;
      user.role = role;
      await user.save({ validateBeforeSave: false });

      console.log(`\n  ${email}: ${previous || "(unset)"} -> ${role}\n`);
      if (role === "admin") {
        console.log(
          "  Sign out and back in — the server reads the role from the database\n" +
            "  on every request, but the client's cached session still shows the\n" +
            "  old value.\n"
        );
      }
    },
  },

  "reset-password": {
    validate([email, provided]) {
      if (!email) {
        throw new UsageError("usage: reset-password <email> [newPassword]");
      }
      if (provided !== undefined && provided.length < 6) {
        throw new UsageError(
          "password must be at least 6 characters — the model enforces this"
        );
      }
      return { email, provided };
    },
    async run({ email, provided }) {
      const user = await findUser(email);

      let password = provided;
      if (!password) {
        password = await ask(`  New password for ${email}: `, { silent: true });
        if (!password || password.length < 6) {
          throw new Error("password must be at least 6 characters");
        }
      }

      user.password = await bcrypt.hash(password, BCRYPT_COST);
      await user.save({ validateBeforeSave: false });

      console.log(`\n  Password reset for ${email}. Sign in at /login.\n`);
      if (provided) {
        console.log(
          "  You passed the password as an argument, so it is now in your shell\n" +
            "  history. Clear it, or use the interactive prompt next time.\n"
        );
      }
    },
  },
};

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command || ["-h", "--help", "help"].includes(command)) {
    console.log(USAGE);
    return;
  }

  const spec = COMMANDS[command];
  if (!spec) {
    throw new UsageError(`unknown command "${command}"${USAGE}`);
  }

  // Validate first — no connection needed to reject bad input.
  const parsed = spec.validate(args);

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new UsageError(
      "MONGODB_URI is not set. Copy docs/env.template to .env.local and fill it\n" +
        "  in, or export MONGODB_URI for this command."
    );
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS,
    });
  } catch (err) {
    throw new Error(
      `could not reach MongoDB within ${CONNECT_TIMEOUT_MS}ms.\n` +
        `  ${err.message}\n\n` +
        "  If this is a MongoDB Atlas free-tier (M0) cluster, check whether it has\n" +
        "  been paused for inactivity, and confirm your IP is in the access list."
    );
  }

  await spec.run(parsed);
}

main()
  .catch((err) => {
    if (err instanceof UsageError) {
      console.error(`\n  ${err.message}\n`);
    } else {
      console.error(`\n  error: ${err.message}\n`);
    }
    process.exitCode = 1;
  })
  .finally(() => mongoose.connection.close());
