import { Octokit } from "octokit";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function getRepoFileContent(
  owner: string,
  repo: string,
  path: string
) {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(data) || !("content" in data)) {
      throw new Error(`Path ${path} is a directory, not a file`);
    }

    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return null;
  }
}

export async function getIssueComments(
  owner: string,
  repo: string,
  issueNumber: number
) {
  const { data } = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber,
  });
  return data;
}

// Recursive function to get all markdown files in a directory
export async function getMarkdownFiles(
  owner: string,
  repo: string,
  path: string = ""
) {
  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
  });

  let files: { path: string; content: string }[] = [];

  if (Array.isArray(data)) {
    for (const item of data) {
      if (item.type === "file" && item.name.endsWith(".md")) {
        const content = await getRepoFileContent(owner, repo, item.path);
        if (content) {
          files.push({ path: item.path, content });
        }
      } else if (item.type === "dir") {
        const subFiles = await getMarkdownFiles(owner, repo, item.path);
        files = files.concat(subFiles);
      }
    }
  }

  return files;
}
