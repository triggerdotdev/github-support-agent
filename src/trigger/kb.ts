import { schedules } from "@trigger.dev/sdk";
import { prisma } from "@/lib/prisma";

export const nightlyMaintenance = schedules.task({
    id: "nightly-maintenance",
    cron: "0 0 * * *", // Midnight
    run: async () => {
        // 1. Fetch recent KB entries
        // 2. Deduplicate using embeddings
        // 3. Compress old entries
        return { status: "maintained" };
    }
});

