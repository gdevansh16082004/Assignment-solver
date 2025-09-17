import { Router } from 'express';
import { getBatchEmbeddings } from '../utils/embeddingService';
import { queryVectorDB } from '../utils/vectorDBClient';
import { getLLMSolution } from '../utils/llmService';
import { connectToDatabase } from '../utils/mongodb';
import InteractionLog from '../models/InteractionLog';
import Task from '../models/Task';

const router = Router();

router.post('/', async (req, res) => {
    await connectToDatabase();

    const { taskId, question } = req.body;

    const embeddings = await getBatchEmbeddings(question);
    const queryEmbedding = embeddings[0];
    const topChunks = await queryVectorDB(queryEmbedding, 3);

    const prompt = `
You are an expert tutor. Based on the following document sections, answer the assignment question:

Question: ${question}

Document Chunks:
${topChunks.map(chunk => chunk.textChunk).join('\n---\n')}
    `;

    const llmResponse = await getLLMSolution(prompt);

    // Log interaction
    const log = new InteractionLog({
        taskId,
        submittedAt: new Date(),
        taskDescription: question,
        promptToEmbeddingAPI: question,
        embeddingResponse: queryEmbedding,
        promptToVectorDB: topChunks,
        vectorDBResponse: topChunks,
        promptToLLM: prompt,
        llmResponse,
        solutionGeneratedAt: new Date()
    });
    await log.save();

    // Update Task Status
    await Task.findByIdAndUpdate(taskId, { status: 'Solution Generated' });

    res.json({ solution: llmResponse });
});

export default router;
