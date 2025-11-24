import { schedules } from "@trigger.dev/sdk";
import { prisma } from "@/lib/prisma";

export const ingestDocs = schedules.task({
    id: "ingest-docs",
    cron: "0 */6 * * *", // Every 6 hours
    run: async (payload) => {
        // 1. Fetch docs (mocked)
        // In a real app, fetch from GitHub API or file system
        const docs = [{ path: "/docs/intro", content: "# Intro..." }];
        
        // 2. Process and store
        // This would involve chunking the content and creating embeddings
        for (const doc of docs) {
             // ... chunking and embedding ...
             // await prisma.docChunk.create(...)
        }
        return { count: docs.length };
    }
});

