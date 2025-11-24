import { schedules } from "@trigger.dev/sdk";
import { prisma } from "@/lib/prisma";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { generateEmbedding } from "@/lib/ai";
import crypto from "node:crypto";

export const nightlyMaintenance = schedules.task({
  id: "nightly-maintenance",
  cron: "0 0 * * *", // Midnight
  run: async () => {
    const results = [];

    // 1. Fetch all active KB entries
    // We iterate through them to find clusters
    // Note: querying all might be heavy for large DBs, would paginate in real app
    const entries = await prisma.kbEntry.findMany({
      where: { mergedIntoId: null },
      select: { id: true, questionCanonical: true, answer: true, tags: true },
    });

    const processedIds = new Set<string>();
    let mergedCount = 0;

    for (const entry of entries) {
      if (processedIds.has(entry.id)) continue;

      // 2. Find similar entries (semantic duplicates)
      const neighborsWithDistance = await prisma.$queryRaw<any[]>`
        SELECT id, "questionCanonical", answer, tags, (embedding <-> (SELECT embedding FROM "KbEntry" WHERE id = ${entry.id})) as distance
        FROM "KbEntry"
        WHERE "mergedIntoId" IS NULL
        AND id != ${entry.id}
        ORDER BY distance ASC
        LIMIT 5
      `;

      const candidates = neighborsWithDistance.filter(
        (n: any) => n.distance < 0.15
      ); // 0.15 threshold

      if (candidates.length > 0) {
        const cluster = [entry, ...candidates];

        // Mark all as processed
        cluster.forEach((c) => processedIds.add(c.id));

        // 3. Merge logic via LLM
        const prompt = `
The following Q&A pairs seem very similar. Please consolidate them into a single, high-quality canonical Q&A pair.
If they are not actually referring to the same issue, just return the best one as is.

ENTRIES:
${cluster
  .map((c) => `Q: ${c.questionCanonical}\nA: ${c.answer}`)
  .join("\n---\n")}
`;

        const { object: merged } = await generateObject({
          model: openai("gpt-4o"),
          schema: z.object({
            question: z.string(),
            answer: z.string(),
            tags: z.array(z.string()),
          }),
          system: "You are a knowledge base maintainer.",
          prompt,
        });

        const newEmbedding = await generateEmbedding(merged.question);
        const embeddingString = `[${newEmbedding.join(",")}]`;

        // 4. Create new merged entry
        // Using raw query for vector support
        const newId = crypto.randomUUID();
        await prisma.$executeRaw`
          INSERT INTO "KbEntry" (id, "questionRaw", "questionCanonical", answer, tags, embedding, "createdAt", "updatedAt")
          VALUES (${newId}, 'Merged Entry', ${merged.question}, ${merged.answer}, ${merged.tags}, ${embeddingString}::vector, NOW(), NOW())
        `;

        // 5. Mark originals as merged
        await prisma.kbEntry.updateMany({
          where: { id: { in: cluster.map((c) => c.id) } },
          data: { mergedIntoId: newId },
        });

        mergedCount++;
      }
    }
    results.push({ mergedClusters: mergedCount });

    return { results };
  },
});
