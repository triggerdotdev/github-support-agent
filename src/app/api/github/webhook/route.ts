import { NextResponse } from "next/server";
import { issueOpened, issueClosed } from "@/trigger/issues";
import crypto from "node:crypto";

export async function POST(request: Request) {
  const payloadText = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  const event = request.headers.get("x-github-event");

  // 1. Verify Signature
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (secret && signature) {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = "sha256=" + hmac.update(payloadText).digest("hex");
    if (signature !== digest) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
      // Enforce secret in production
      return NextResponse.json({ error: "Missing webhook secret configuration" }, { status: 500 });
  }

  const payload = JSON.parse(payloadText);

  // 2. Validate against env var repo
  const repoName = payload.repository?.name;
  const repoOwner = payload.repository?.owner?.login;
  const expectedOwner = process.env.GITHUB_OWNER;
  const expectedRepo = process.env.GITHUB_REPO;

  if (!repoName || !repoOwner) {
      return NextResponse.json({ error: "Invalid payload: missing repository info" }, { status: 400 });
  }

  if (expectedOwner && expectedRepo) {
      if (repoName !== expectedRepo || repoOwner !== expectedOwner) {
          console.log(`Ignored event for ${repoOwner}/${repoName} (expected ${expectedOwner}/${expectedRepo})`);
          return NextResponse.json({ ignored: true }, { status: 200 });
      }
  }

  // 3. Handle Events
  if (event === "issues") {
    const { action, issue } = payload;
    
    if (action === "opened") {
      await issueOpened.trigger({
        issue
      });
    } else if (action === "closed") {
      await issueClosed.trigger({
        issue
      });
    }
  }

  return NextResponse.json({ received: true });
}
