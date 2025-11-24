import { task } from "@trigger.dev/sdk";
import { prisma } from "@/lib/prisma";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

// Helper to mimic RAG retrieval
async function retrieveContext(projectId: string, query: string) {
  // In a real app, we'd run:
  // const { embedding } = await embed({ model: openai.embedding("text-embedding-3-small"), value: query });
  // const docs = await prisma.$queryRaw`SELECT * FROM "DocChunk" ORDER BY embedding <-> ${embedding} LIMIT 5`;
  // const kbs = await prisma.$queryRaw`SELECT * FROM "KbEntry" ORDER BY embedding <-> ${embedding} LIMIT 5`;
  
  // Mock return for now
  return { docs: [], kbs: [] };
}

export const issueOpened = task({
  id: "issue-opened",
  run: async (payload: {
    issue: any; // Use any for simplicity in example
    projectId: string;
  }) => {
    const { issue, projectId } = payload;

    // 1. Persist Issue
    const dbIssue = await prisma.issue.create({
      data: {
        project: { connect: { id: projectId } },
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
                createdAt: new Date()
            }
        }
      },
    });

    // 2. Classify
    const classification = await generateText({
      model: openai("gpt-4o"),
      system: "Classify this issue: bug, question, feature, or other.",
      prompt: `Title: ${issue.title}\n\nBody: ${issue.body}`,
    });

    const type = classification.text.trim().toLowerCase();
    await prisma.issue.update({
        where: { id: dbIssue.id },
        data: { classification: type }
    });

    // 3. Retrieve
    const context = await retrieveContext(projectId, `${issue.title} ${issue.body}`);

    // 4. Draft
    const draft = await generateText({
      model: openai("gpt-4o"),
      system: "You are a support engineer. Draft a reply.",
      prompt: `User issue: ${issue.title}\n\nContext: ${JSON.stringify(context)}`,
    });

    // 5. Save Draft
    await prisma.issueDraft.create({
        data: {
            issueId: dbIssue.id,
            draftBody: draft.text,
            modelName: "gpt-4o",
            retrievalMeta: context
        }
    });

    return { success: true, draftId: dbIssue.id };
  },
});

export const issueClosed = task({
    id: "issue-closed",
    run: async (payload: { issue: any; projectId: string }) => {
        const { issue, projectId } = payload;
        // Fetch full thread (mocked here)
        const thread = `Issue: ${issue.title}\nBody: ${issue.body}`;
        
        // Summarize
        const summary = await generateText({
            model: openai("gpt-4o"),
            system: "Summarize this resolved issue into a Q&A pair.",
            prompt: thread
        });

        // Save to KB
        await prisma.kbEntry.create({
            data: {
                project: { connect: { id: projectId } },
                questionRaw: issue.title,
                questionCanonical: issue.title, // In real app, LLM generates this
                answer: summary.text,
                sourceUrl: issue.html_url
            }
        });
    }
})

