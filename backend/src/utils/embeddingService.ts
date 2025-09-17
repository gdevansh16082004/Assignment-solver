import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  throw new Error('MISTRAL_API_KEY is not set in environment variables');
}

const client = new Mistral({ apiKey });

export async function getBatchEmbeddings(texts: string[]): Promise<number[][]> {
  if (!texts || texts.length === 0) {
    return [];
  }

  try {
    const embeddingsBatchResponse = await client.embeddings.create({
      model: 'mistral-embed',
      inputs: texts,
    });

    // Return the array of embedding vectors from the response, filtering out undefined
    return embeddingsBatchResponse.data
      .map(item => item.embedding)
      .filter((embedding): embedding is number[] => Array.isArray(embedding));
  } catch (error) {
    console.error('Error getting batch embeddings from Mistral:', error);
    throw new Error('Failed to generate embeddings.');
  }
}