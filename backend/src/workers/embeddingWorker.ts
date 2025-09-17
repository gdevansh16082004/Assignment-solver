// src/workers/embeddingWorker.ts
import { Worker, Job } from 'bullmq';
import { EmbeddingJobData, EMBEDDING_JOB_NAME } from '../jobs/embeddingQueue';
import Task from '../models/Task';
import Chunk from '../models/Chunk';
import { getBatchEmbeddings } from '../utils/embeddingService'; // <-- Use the new batch function
import { upsertChunks } from '../utils/vectorDBClient';
import { v4 as uuidv4 } from 'uuid';

const processEmbeddingJob = async (job: Job<EmbeddingJobData>) => {
  const { taskId } = job.data;
  console.log(`Processing job for taskId: ${taskId}`);

  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error(`Task with ID ${taskId} not found.`);
  }

  try {
    task.status = 'Embedding in Progress';
    await task.save();

    // 1. Prepare all text chunks first
    const words = task.description.split(' ');
    const chunkSize = 500;
    const textChunks: string[] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk) {
        textChunks.push(chunk);
      }
    }

    if (textChunks.length === 0) {
        task.status = 'Embedding Done'; // Or a new status like 'No Content'
        await task.save();
        console.log(`No text chunks to process for taskId: ${taskId}`);
        return;
    }
    
    // 2. Get all embeddings in a single API call
    console.log(`Requesting embeddings for ${textChunks.length} chunks...`);
    const embeddings = await getBatchEmbeddings(textChunks);
    console.log('Received embeddings.');

    // 3. Loop through the results to save everything
    const chunksToUpsert = [];
    for (let i = 0; i < textChunks.length; i++) {
      const chunkId = uuidv4();
      const chunkData = {
        taskId,
        textChunk: textChunks[i],
        chunkId,
      };

      // Save chunk metadata to MongoDB
      const chunkDocument = new Chunk(chunkData);
      await chunkDocument.save();
      
      // Prepare data for Qdrant
      chunksToUpsert.push({
        id: chunkId,
        embedding: embeddings[i],
        textChunk: textChunks[i],
      });
    }

    // 4. Upsert all chunks to Qdrant at once
    console.log(`Sending ${chunksToUpsert.length} chunks to Qdrant...`);
    await upsertChunks(chunksToUpsert);

    task.status = 'Embedding Done';
    await task.save();
    console.log(`Successfully completed job for taskId: ${taskId}`);

  } catch (error) {
    console.error(`Job for taskId: ${taskId} failed.`, error);
    if (task) {
      task.status = 'Embedding Failed';
      await task.save();
    }
    throw error;
  }
};

// ... (The rest of your worker setup with BullMQ connection)
export const embeddingWorker = new Worker<EmbeddingJobData>(EMBEDDING_JOB_NAME, processEmbeddingJob, {
    /* ... connection details ... */
});