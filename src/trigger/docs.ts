import { schedules } from "@trigger.dev/sdk";
import { prisma } from "@/lib/prisma";
import { getRepoFileContent } from "@/lib/github";
import { generateEmbedding } from "@/lib/ai";
import { getMintlifyPages } from "@/lib/mintlify";
import crypto from "node:crypto";
import path from "path";

// Simple chunking by H2 headers
// Note: In a production app, use a more robust splitter (e.g. by recursive character count or markdown structure)
function chunkMarkdown(
  content: string
): { heading: string; content: string }[] {
  const chunks: { heading: string; content: string }[] = [];
  const lines = content.split("\n");
  let currentHeading = "Introduction";
  let currentBuffer: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentBuffer.length > 0) {
        chunks.push({
          heading: currentHeading,
          content: currentBuffer.join("\n"),
        });
      }
      currentHeading = line.replace("## ", "").trim();
      currentBuffer = [];
    } else {
      currentBuffer.push(line);
    }
  }
  if (currentBuffer.length > 0) {
    chunks.push({ heading: currentHeading, content: currentBuffer.join("\n") });
  }

  return chunks;
}

export const ingestDocs = schedules.task({
  id: "ingest-docs",
  cron: "0 */6 * * *", // Every 6 hours
  run: async () => {
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const configPath = process.env.DOCS_CONFIG_PATH || "mint.json";

    if (!owner || !repo) {
      throw new Error("GITHUB_OWNER and GITHUB_REPO env vars must be set");
    }

    let totalChunks = 0;

    // Determine base path for docs (relative to repo root)
    // If config is at "docs/mint.json", base path is "docs/"
    const docsRoot = path.dirname(configPath);

    // 1. Get list of pages from Mintlify config
    const pages = await getMintlifyPages(owner, repo, configPath);
    if (pages.length === 0) {
      console.log("No pages found in Mintlify config or config missing.");
      return { processed: 0 };
    }

    // 2. Iterate and fetch content
    for (const page of pages) {
      // Construct full path based on docs root
      // Mintlify pages are relative to the config file location usually
      const fullPagePath = path.join(docsRoot, page);

      // Mintlify pages often omit extension in config, try .mdx then .md
      let filePath = fullPagePath;
      if (!filePath.endsWith(".md") && !filePath.endsWith(".mdx")) {
        filePath += ".mdx";
      }

      let content = await getRepoFileContent(owner, repo, filePath);
      if (!content) {
        // Try .md
        filePath = fullPagePath + ".md";
        content = await getRepoFileContent(owner, repo, filePath);
      }

      if (!content) {
        console.warn(
          `Could not find content for page: ${page} (tried ${filePath})`
        );
        continue;
      }

      const chunks = chunkMarkdown(content);

      for (const chunk of chunks) {
        const hash = crypto
          .createHash("sha256")
          .update(filePath + chunk.content)
          .digest("hex");

        // Check if chunk exists and hasn't changed
        const existing = await prisma.docChunk.findFirst({
          where: { hash },
        });

        if (!existing) {
          const embedding = await generateEmbedding(
            `${chunk.heading}\n${chunk.content}`
          );
          // Format embedding for pgvector
          const embeddingString = `[${embedding.join(",")}]`;

          // Delete old chunks for this path/heading to avoid stale data if content changed
          await prisma.docChunk.deleteMany({
            where: {
              sourcePath: filePath,
              heading: chunk.heading,
              NOT: { hash }, // Don't delete if we just inserted it (edge case)
            },
          });

          // Using raw query for vector insertion until Prisma fully supports it
          await prisma.$executeRaw`
                        INSERT INTO "DocChunk" (id, source, "sourcePath", heading, content, hash, embedding, "createdAt", "updatedAt")
                        VALUES (gen_random_uuid(), 'docs', ${filePath}, ${chunk.heading}, ${chunk.content}, ${hash}, ${embeddingString}::vector, NOW(), NOW())
                    `;

          totalChunks++;
        }
      }
    }

    return { processed: totalChunks };
  },
});
