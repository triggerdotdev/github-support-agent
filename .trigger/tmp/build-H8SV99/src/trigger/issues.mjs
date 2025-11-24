import {
  getIssueComments
} from "../../chunk-FEXJELTJ.mjs";
import "../../chunk-CIO26P33.mjs";
import {
  external_exports,
  generateEmbedding,
  generateObject,
  generateText,
  openai,
  prisma
} from "../../chunk-ZHZJMKKJ.mjs";
import "../../chunk-XP4SUQOC.mjs";
import "../../chunk-O4XVKKWH.mjs";
import {
  task
} from "../../chunk-4IHIUCUY.mjs";
import "../../chunk-USHNXJ63.mjs";
import "../../chunk-IORKQ53J.mjs";
import "../../chunk-LJVEFIEN.mjs";
import "../../chunk-IA2HBA2V.mjs";
import {
  __name,
  init_esm
} from "../../chunk-244PAGAH.mjs";

// src/trigger/issues.ts
init_esm();
async function retrieveContext(query) {
  const embedding = await generateEmbedding(query);
  const embeddingString = `[${embedding.join(",")}]`;
  const docs = await prisma.$queryRaw`
    SELECT id, content, heading, "sourcePath"
    FROM "DocChunk"
    ORDER BY embedding <-> ${embeddingString}::vector
    LIMIT 5
  `;
  const kbs = await prisma.$queryRaw`
    SELECT id, "questionCanonical", answer, "sourceUrl"
    FROM "KbEntry"
    ORDER BY embedding <-> ${embeddingString}::vector
    LIMIT 3
  `;
  return { docs, kbs };
}
__name(retrieveContext, "retrieveContext");
var issueOpened = task({
  id: "issue-opened",
  run: /* @__PURE__ */ __name(async (payload) => {
    const { issue } = payload;
    const dbIssue = await prisma.issue.create({
      data: {
        githubNumber: issue.number,
        title: issue.title,
        body: issue.body || "",
        state: "open",
        url: issue.html_url,
        labels: issue.labels || [],
        createdAt: /* @__PURE__ */ new Date(),
        messages: {
          create: {
            author: issue.user?.login || "unknown",
            body: issue.body || "",
            createdAt: /* @__PURE__ */ new Date()
          }
        }
      }
    });
    const { object: classification } = await generateObject({
      model: openai("gpt-4o"),
      schema: external_exports.object({
        type: external_exports.enum(["bug", "question", "feature", "other"]),
        reasoning: external_exports.string()
      }),
      system: "Classify this issue based on the title and body.",
      prompt: `Title: ${issue.title}

Body: ${issue.body}`
    });
    await prisma.issue.update({
      where: { id: dbIssue.id },
      data: { classification: classification.type }
    });
    const retrievalQuery = `${issue.title} ${classification.type} ${issue.body?.slice(0, 200)}`;
    const context = await retrieveContext(retrievalQuery);
    await prisma.retrievalLog.create({
      data: {
        issueId: dbIssue.id,
        query: retrievalQuery,
        topDocIds: context.docs.map((d) => d.id),
        topKbIds: context.kbs.map((k) => k.id),
        rawScores: {}
        // In a real app, we'd capture distances from the raw query
      }
    });
    const prompt = `
You are an expert support engineer for this open source project.
Draft a helpful, friendly reply to the user's issue.

CONTEXT FROM DOCUMENTATION:
${context.docs.map((d) => `[${d.heading}]: ${d.content}`).join("\n\n")}

CONTEXT FROM PAST ISSUES:
${context.kbs.map((k) => `Q: ${k.questionCanonical}
A: ${k.answer}`).join("\n\n")}

USER ISSUE:
Title: ${issue.title}
Body: ${issue.body}

INSTRUCTIONS:
- Be concise but thorough.
- If the context provides a clear answer, use it.
- If you are unsure, ask for clarifying information.
- Reference the documentation if relevant.
`;
    const draft = await generateText({
      model: openai("gpt-4o"),
      system: "You are a helpful AI support assistant.",
      prompt
    });
    await prisma.issueDraft.create({
      data: {
        issueId: dbIssue.id,
        draftBody: draft.text,
        modelName: "gpt-4o",
        retrievalMeta: context
      }
    });
    return { success: true, draftId: dbIssue.id };
  }, "run")
});
var issueClosed = task({
  id: "issue-closed",
  run: /* @__PURE__ */ __name(async (payload) => {
    const { issue } = payload;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    if (!owner || !repo)
      throw new Error("GITHUB_OWNER and GITHUB_REPO env vars must be set");
    const dbIssue = await prisma.issue.findFirst({
      where: { githubNumber: issue.number }
    });
    const comments = await getIssueComments(owner, repo, issue.number);
    const fullThread = `
Title: ${issue.title}
Body: ${issue.body}

Comments:
${comments.map((c) => `${c.user?.login}: ${c.body}`).join("\n---\n")}
        `;
    const { object: summary } = await generateObject({
      model: openai("gpt-4o"),
      schema: external_exports.object({
        question: external_exports.string().describe("Canonical question phrasing"),
        answer: external_exports.string().describe("Consolidated answer including code snippets if any"),
        tags: external_exports.array(external_exports.string())
      }),
      system: "Summarize this resolved GitHub issue into a useful Q&A pair for a knowledge base.",
      prompt: fullThread
    });
    const embedding = await generateEmbedding(summary.question);
    const embeddingString = `[${embedding.join(",")}]`;
    await prisma.$executeRaw`
            INSERT INTO "KbEntry" (id, "issueId", "questionRaw", "questionCanonical", answer, tags, "sourceUrl", embedding, "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), ${dbIssue?.id || null}, ${issue.title}, ${summary.question}, ${summary.answer}, ${summary.tags}, ${issue.html_url}, ${embeddingString}::vector, NOW(), NOW())
        `;
  }, "run")
});
export {
  issueClosed,
  issueOpened
};
//# sourceMappingURL=issues.mjs.map
