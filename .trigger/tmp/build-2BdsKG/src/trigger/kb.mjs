import "../../chunk-CIO26P33.mjs";
import {
  external_exports,
  generateEmbedding,
  generateObject,
  openai,
  prisma
} from "../../chunk-ZHZJMKKJ.mjs";
import "../../chunk-XP4SUQOC.mjs";
import "../../chunk-O4XVKKWH.mjs";
import {
  schedules_exports
} from "../../chunk-4IHIUCUY.mjs";
import "../../chunk-USHNXJ63.mjs";
import "../../chunk-IORKQ53J.mjs";
import "../../chunk-LJVEFIEN.mjs";
import "../../chunk-IA2HBA2V.mjs";
import {
  __name,
  init_esm
} from "../../chunk-244PAGAH.mjs";

// src/trigger/kb.ts
init_esm();
import crypto from "node:crypto";
var nightlyMaintenance = schedules_exports.task({
  id: "nightly-maintenance",
  cron: "0 0 * * *",
  // Midnight
  run: /* @__PURE__ */ __name(async () => {
    const results = [];
    const entries = await prisma.kbEntry.findMany({
      where: { mergedIntoId: null },
      select: { id: true, questionCanonical: true, answer: true, tags: true }
    });
    const processedIds = /* @__PURE__ */ new Set();
    let mergedCount = 0;
    for (const entry of entries) {
      if (processedIds.has(entry.id)) continue;
      const neighborsWithDistance = await prisma.$queryRaw`
        SELECT id, "questionCanonical", answer, tags, (embedding <-> (SELECT embedding FROM "KbEntry" WHERE id = ${entry.id})) as distance
        FROM "KbEntry"
        WHERE "mergedIntoId" IS NULL
        AND id != ${entry.id}
        ORDER BY distance ASC
        LIMIT 5
      `;
      const candidates = neighborsWithDistance.filter(
        (n) => n.distance < 0.15
      );
      if (candidates.length > 0) {
        const cluster = [entry, ...candidates];
        cluster.forEach((c) => processedIds.add(c.id));
        const prompt = `
The following Q&A pairs seem very similar. Please consolidate them into a single, high-quality canonical Q&A pair.
If they are not actually referring to the same issue, just return the best one as is.

ENTRIES:
${cluster.map((c) => `Q: ${c.questionCanonical}
A: ${c.answer}`).join("\n---\n")}
`;
        const { object: merged } = await generateObject({
          model: openai("gpt-4o"),
          schema: external_exports.object({
            question: external_exports.string(),
            answer: external_exports.string(),
            tags: external_exports.array(external_exports.string())
          }),
          system: "You are a knowledge base maintainer.",
          prompt
        });
        const newEmbedding = await generateEmbedding(merged.question);
        const embeddingString = `[${newEmbedding.join(",")}]`;
        const newId = crypto.randomUUID();
        await prisma.$executeRaw`
          INSERT INTO "KbEntry" (id, "questionRaw", "questionCanonical", answer, tags, embedding, "createdAt", "updatedAt")
          VALUES (${newId}, 'Merged Entry', ${merged.question}, ${merged.answer}, ${merged.tags}, ${embeddingString}::vector, NOW(), NOW())
        `;
        await prisma.kbEntry.updateMany({
          where: { id: { in: cluster.map((c) => c.id) } },
          data: { mergedIntoId: newId }
        });
        mergedCount++;
      }
    }
    results.push({ mergedClusters: mergedCount });
    return { results };
  }, "run")
});
export {
  nightlyMaintenance
};
//# sourceMappingURL=kb.mjs.map
