import axios, { AxiosError } from 'axios';

// Ensure your .env file has these variables
const QDRANT_API_URL = process.env.QDRANT_API_URL || '';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || '';
const QDRANT_COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME || '';

type DocumentChunk = {
    id: string;
    embedding: number[];
    textChunk: string;
};

export async function upsertChunks(chunks: DocumentChunk[]) {
    // Qdrant expects points to have `id`, `vector`, and `payload` (for metadata)
    const points = chunks.map(chunk => ({
        id: chunk.id,
        vector: chunk.embedding,
        payload: { textChunk: chunk.textChunk },
    }));

    // The correct endpoint includes the collection name
    const url = `${QDRANT_API_URL}/collections/${QDRANT_COLLECTION_NAME}/points`;

    try {
        // Use PUT for upsert operations
        await axios.put(
            url,
            { points }, // The payload is an object with a `points` array
            { 
                headers: { 
                    'api-key': QDRANT_API_KEY,
                    'Content-Type': 'application/json'
                } 
            }
        );
        console.log(`Successfully upserted ${points.length} points.`);
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error upserting chunks:", axiosError.response?.data);
        throw new Error("Failed to upsert chunks to Qdrant.");
    }
}

export async function queryVectorDB(
    queryEmbedding: number[] | null,
    topK = 3
): Promise<{ id: string; textChunk: string }[]> {
    // The correct endpoint for searching
    const url = `${QDRANT_API_URL}/collections/${QDRANT_COLLECTION_NAME}/points/search`;

    try {
        const res = await axios.post(
            url,
            {
                vector: queryEmbedding,
                limit: topK, // Qdrant uses `limit` instead of `topK`
                with_payload: true, // Qdrant uses `with_payload` to include metadata
            },
            { 
                headers: { 
                    'api-key': QDRANT_API_KEY,
                    'Content-Type': 'application/json'
                } 
            }
        );

        // The response data is in `res.data.result`
        return res.data.result.map((match: any) => ({
            id: match.id,
            // The metadata is in `match.payload`
            textChunk: match.payload?.textChunk || '',
        }));
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error querying vector DB:", axiosError.response?.data);
        throw new Error("Failed to query Qdrant.");
    }
}