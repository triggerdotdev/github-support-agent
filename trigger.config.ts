import { defineConfig } from "@trigger.dev/sdk";
import { prismaExtension } from "@trigger.dev/build/extensions/prisma";

export default defineConfig({
  project: "proj_placeholder",
  runtime: "node",
  logLevel: "info",
  // The directories where your trigger tasks are located
  dirs: ["./src/trigger"],
  build: {
    extensions: [
      prismaExtension({
        schema: "prisma/schema.prisma",
        // verify we want migrations to run on build
        migrate: true,
        // We'll use DATABASE_URL for now, user can configure DIRECT_URL if needed
        directUrlEnvVarName: "DATABASE_URL",
      }),
    ],
  },
});
