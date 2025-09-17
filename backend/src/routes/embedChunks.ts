// src/routes/embedChunks.ts
import { Router } from 'express';
import { getBatchEmbeddings } from '../utils/embeddingService'; // Updated import name
import { upsertChunks } from '../utils/vectorDBClient';
import Chunk from '../models/Chunk';
import { v4 as uuidv4 } from 'uuid';
import Task from '../models/Task';
import { connectToDatabase } from '../utils/mongodb';

const router = Router();

router.post('/', async (req, res) => {
  try {
    await connectToDatabase();

    const { taskId } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // --- Step 1: Prepare all text chunks ---
    const words = task.description.split(' ');
    const chunkSize = 500;
    const textChunks: string[] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunkText = words.slice(i, i + chunkSize).join(' ');
      if (chunkText) {
        textChunks.push(chunkText);
      }
    }

    if (textChunks.length === 0) {
        task.status = 'Embedding Done';
        await task.save();
        return res.json({ message: 'No text content to embed.' });
    }

    // --- Step 2: Get all embeddings in a single batch request ---
    console.log(`Start to generate embeddings for ${textChunks.length} chunks...`);
    const embeddings = await getBatchEmbeddings(textChunks);
    console.log("Embeddings received.");

    // --- Step 3: Loop through the results to save to DBs ---
    const chunksForVectorDB = [];
    for (let i = 0; i < textChunks.length; i++) {
      const chunkId = uuidv4();

      // Save chunk metadata in MongoDB
      const chunk = new Chunk({
        taskId,
        textChunk: textChunks[i],
        chunkId,
      });
      await chunk.save();

      // Prepare data for Qdrant
      chunksForVectorDB.push({
        id: chunkId,
        embedding: embeddings[i],
        textChunk: textChunks[i],
      });
    }

    console.log("Sending to Qdrant...");
    await upsertChunks(chunksForVectorDB);

    task.status = 'Embedding Done';
    await task.save();

    res.json({ message: 'Chunks embedded and stored successfully.' });

  } catch (error) {
    console.error("An error occurred during the embedding process:", error);
    // It's good practice to also try and update the task status to 'Failed' here
    // before sending the error response.
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

export default router;