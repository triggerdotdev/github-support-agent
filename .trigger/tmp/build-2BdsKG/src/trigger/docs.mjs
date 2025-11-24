import {
  getRepoFileContent
} from "../../chunk-FEXJELTJ.mjs";
import {
  generateEmbedding,
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

// src/trigger/docs.ts
init_esm();

// src/lib/mintlify.ts
init_esm();
async function getMintlifyPages(owner, repo, configPath) {
  try {
    const content = await getRepoFileContent(owner, repo, configPath);
    if (!content) {
      console.warn(`Mintlify config not found at ${configPath}`);
      return [];
    }
    const config = JSON.parse(content);
    return extractPages(config.navigation);
  } catch (error) {
    console.error("Error parsing Mintlify config:", error);
    return [];
  }
}
__name(getMintlifyPages, "getMintlifyPages");
function extractPages(nav) {
  let pages = [];
  if (!Array.isArray(nav) && typeof nav === "object" && "dropdowns" in nav) {
    return extractPages(nav.dropdowns);
  }
  if (Array.isArray(nav)) {
    for (const item of nav) {
      if (typeof item === "string") {
        pages.push(item);
      } else if (typeof item === "object") {
        if ("dropdown" in item && item.groups) {
          pages = pages.concat(extractPages(item.groups));
        } else if ("group" in item && item.pages) {
          pages = pages.concat(extractPages(item.pages));
        }
      }
    }
  }
  return pages;
}
__name(extractPages, "extractPages");

// src/trigger/docs.ts
import crypto from "node:crypto";
import path from "path";
function chunkMarkdown(content) {
  const chunks = [];
  const lines = content.split("\n");
  let currentHeading = "Introduction";
  let currentBuffer = [];
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentBuffer.length > 0) {
        chunks.push({
          heading: currentHeading,
          content: currentBuffer.join("\n")
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
__name(chunkMarkdown, "chunkMarkdown");
var ingestDocs = schedules_exports.task({
  id: "ingest-docs",
  cron: "0 */6 * * *",
  // Every 6 hours
  run: /* @__PURE__ */ __name(async () => {
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const configPath = process.env.DOCS_CONFIG_PATH || "mint.json";
    if (!owner || !repo) {
      throw new Error("GITHUB_OWNER and GITHUB_REPO env vars must be set");
    }
    let totalChunks = 0;
    const docsRoot = path.dirname(configPath);
    const pages = await getMintlifyPages(owner, repo, configPath);
    if (pages.length === 0) {
      console.log("No pages found in Mintlify config or config missing.");
      return { processed: 0 };
    }
    for (const page of pages) {
      const fullPagePath = path.join(docsRoot, page);
      let filePath = fullPagePath;
      if (!filePath.endsWith(".md") && !filePath.endsWith(".mdx")) {
        filePath += ".mdx";
      }
      let content = await getRepoFileContent(owner, repo, filePath);
      if (!content) {
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
        const hash = crypto.createHash("sha256").update(filePath + chunk.content).digest("hex");
        const existing = await prisma.docChunk.findFirst({
          where: { hash }
        });
        if (!existing) {
          const embedding = await generateEmbedding(
            `${chunk.heading}
${chunk.content}`
          );
          const embeddingString = `[${embedding.join(",")}]`;
          await prisma.docChunk.deleteMany({
            where: {
              sourcePath: filePath,
              heading: chunk.heading,
              NOT: { hash }
              // Don't delete if we just inserted it (edge case)
            }
          });
          await prisma.$executeRaw`
                        INSERT INTO "DocChunk" (id, source, "sourcePath", heading, content, hash, embedding, "createdAt", "updatedAt")
                        VALUES (gen_random_uuid(), 'docs', ${filePath}, ${chunk.heading}, ${chunk.content}, ${hash}, ${embeddingString}::vector, NOW(), NOW())
                    `;
          totalChunks++;
        }
      }
    }
    return { processed: totalChunks };
  }, "run")
});
export {
  ingestDocs
};
//# sourceMappingURL=docs.mjs.map
