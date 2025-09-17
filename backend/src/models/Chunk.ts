import { Schema, model, Document, Types } from 'mongoose';

export interface IChunk extends Document {
    taskId: Types.ObjectId;     // Reference to Task
    textChunk: string;
    chunkId: string;    // Unique ID (used in Vector DB)
    createdAt: Date;
}

const ChunkSchema = new Schema<IChunk>({
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    textChunk: { type: String, required: true },
    chunkId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default model<IChunk>('Chunk', ChunkSchema);
