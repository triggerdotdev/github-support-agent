import { task } from "@trigger.dev/sdk";
import { prisma } from "@/lib/prisma";
import { openai } from "@ai-sdk/openai";
import { generateText, generateObject } from "ai";
import { z } from "zod";
import { generateEmbedding } from "@/lib/ai";
import { getIssueComments } from "@/lib/github";

// Helper to perform RAG retrieval
async function retrieveContext(query: string) {
  const embedding = await generateEmbedding(query);
  const embeddingString = `[${embedding.join(",")}]`;

  // Find relevant docs
  const docs = await prisma.$queryRaw<any[]>`
    SELECT id, content, heading, "sourcePath"
    FROM "DocChunk"
    ORDER BY embedding <-> ${embeddingString}::vector
    LIMIT 5
  `;

  // Find relevant past Q&A
  const kbs = await prisma.$queryRaw<any[]>`
    SELECT id, "questionCanonical", answer, "sourceUrl"
    FROM "KbEntry"
    ORDER BY embedding <-> ${embeddingString}::vector
    LIMIT 3
  `;

  return { docs, kbs };
}

export const issueOpened = task({
  id: "issue-opened",
  run: async (payload: { issue: any }) => {
    const { issue } = payload;

    // 1. Persist Issue
    // Upsert to handle edits if needed, though for now create is fine for "opened"
    const dbIssue = await prisma.issue.create({
      data: {
        githubNumber: issue.number,
        title: issue.title,
        body: issue.body || "",
        state: "open",
        url: issue.html_url,
        labels: issue.labels || [],
        createdAt: new Date(),
        messages: {
          create: {
            author: issue.user?.login || "unknown",
            body: issue.body || "",
            createdAt: new Date(),
          },
        },
      },
    });

    // 2. Classify
    const { object: classification } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        type: z.enum(["bug", "question", "feature", "other"]),
        reasoning: z.string(),
      }),
      system: "Classify this issue based on the title and body.",
      prompt: `Title: ${issue.title}\n\nBody: ${issue.body}`,
    });

    await prisma.issue.update({
      where: { id: dbIssue.id },
      data: { classification: classification.type },
    });

    // 3. Retrieve
    // We create a "retrieval query" from the issue
    const retrievalQuery = `${issue.title} ${
      classification.type
    } ${issue.body?.slice(0, 200)}`;
    const context = await retrieveContext(retrievalQuery);

    // Log retrieval
    await prisma.retrievalLog.create({
      data: {
        issueId: dbIssue.id,
        query: retrievalQuery,
        topDocIds: context.docs.map((d) => d.id),
        topKbIds: context.kbs.map((k) => k.id),
        rawScores: {}, // In a real app, we'd capture distances from the raw query
      },
    });

    // 4. Draft
    const prompt = `
You are an expert support engineer for this open source project.
Draft a helpful, friendly reply to the user's issue.

CONTEXT FROM DOCUMENTATION:
${context.docs.map((d) => `[${d.heading}]: ${d.content}`).join("\n\n")}

CONTEXT FROM PAST ISSUES:
${context.kbs
  .map((k) => `Q: ${k.questionCanonical}\nA: ${k.answer}`)
  .join("\n\n")}

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
      prompt: prompt,
    });

    // 5. Save Draft
    await prisma.issueDraft.create({
      data: {
        issueId: dbIssue.id,
        draftBody: draft.text,
        modelName: "gpt-4o",
        retrievalMeta: context,
      },
    });

    return { success: true, draftId: dbIssue.id };
  },
});

export const issueClosed = task({
  id: "issue-closed",
  run: async (payload: { issue: any }) => {
    const { issue } = payload;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (!owner || !repo)
      throw new Error("GITHUB_OWNER and GITHUB_REPO env vars must be set");

    // Try to find existing issue in DB
    // Note: we can't query by projectId anymore, so we assume single repo in DB
    // But if we had multiple issues with same number (recreated DB?), this might be ambiguous.
    // In single-tenant app, githubNumber is unique per repo effectively.
    const dbIssue = await prisma.issue.findFirst({
      where: { githubNumber: issue.number },
    });

    // Fetch full thread
    const comments = await getIssueComments(owner, repo, issue.number);
    const fullThread = `
Title: ${issue.title}
Body: ${issue.body}

Comments:
${comments.map((c: any) => `${c.user?.login}: ${c.body}`).join("\n---\n")}
        `;

    // Summarize into Q&A
    const { object: summary } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        question: z.string().describe("Canonical question phrasing"),
        answer: z
          .string()
          .describe("Consolidated answer including code snippets if any"),
        tags: z.array(z.string()),
      }),
      system:
        "Summarize this resolved GitHub issue into a useful Q&A pair for a knowledge base.",
      prompt: fullThread,
    });

    // Generate embedding for the canonical question
    const embedding = await generateEmbedding(summary.question);
    const embeddingString = `[${embedding.join(",")}]`;

    // Save to KB
    await prisma.$executeRaw`
            INSERT INTO "KbEntry" (id, "issueId", "questionRaw", "questionCanonical", answer, tags, "sourceUrl", embedding, "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), ${dbIssue?.id || null}, ${
      issue.title
    }, ${summary.question}, ${summary.answer}, ${summary.tags}, ${
      issue.html_url
    }, ${embeddingString}::vector, NOW(), NOW())
        `;
  },
});
