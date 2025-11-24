import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";

export const embeddingModel = openai.embedding("text-embedding-3-small");

export async function generateEmbedding(text: string) {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
    experimental_telemetry: {
      isEnabled: true,
    },
  });
  return embedding;
}

export async function generateEmbeddings(texts: string[]) {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: texts,
    experimental_telemetry: {
      isEnabled: true,
    },
  });
  return embeddings;
}
