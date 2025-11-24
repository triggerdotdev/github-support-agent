import { defineConfig } from "@trigger.dev/sdk";
import { prismaExtension } from "@trigger.dev/build/extensions/prisma";
import { PrismaInstrumentation } from "@prisma/instrumentation";

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_REF!,
  runtime: "node",
  logLevel: "info",
  maxDuration: 3600, // in seconds (1 hour)
  // The directories where your trigger tasks are located
  dirs: ["./src/trigger"],
  telemetry: {
    instrumentations: [new PrismaInstrumentation()],
  },
  build: {
    extensions: [
      prismaExtension({
        mode: "engine-only",
      }),
    ],
  },
});
