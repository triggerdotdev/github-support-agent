import { NextResponse } from "next/server";
import { issueOpened, issueClosed } from "@/trigger/issues";

export async function POST(request: Request) {
  const payload = await request.json();
  const event = request.headers.get("x-github-event");
  
  // In a real app, verify the webhook signature here using logic like:
  // verifySignature(request.headers.get("x-hub-signature-256"), payload, process.env.GITHUB_WEBHOOK_SECRET);

  // Mock project ID lookup based on repo
  // const project = await prisma.project.findFirst({ where: { githubRepo: payload.repository.name } });
  const projectId = "proj_example_123"; 

  if (event === "issues") {
    const { action, issue } = payload;
    
    if (action === "opened") {
      await issueOpened.trigger({
        issue,
        projectId
      });
    } else if (action === "closed") {
      await issueClosed.trigger({
        issue,
        projectId
      });
    }
  }

  return NextResponse.json({ received: true });
}

