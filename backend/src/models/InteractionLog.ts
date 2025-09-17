import { Schema, model, Document, Types } from 'mongoose';

export interface IInteractionLog extends Document {
    taskId: Types.ObjectId;
    submittedAt: Date;
    taskDescription: string;
    promptToEmbeddingAPI: string;
    embeddingResponse: object;
    promptToVectorDB: object;
    vectorDBResponse: object;
    promptToLLM: string;
    llmResponse: string;
    solutionGeneratedAt: Date;
}

const InteractionLogSchema = new Schema<IInteractionLog>({
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    submittedAt: { type: Date, default: Date.now },
    taskDescription: { type: String, required: true },
    promptToEmbeddingAPI: { type: String, required: true },
    embeddingResponse: { type: Schema.Types.Mixed, required: true },
    promptToVectorDB: { type: Schema.Types.Mixed, required: true },
    vectorDBResponse: { type: Schema.Types.Mixed, required: true },
    promptToLLM: { type: String, required: true },
    llmResponse: { type: String, required: true },
    solutionGeneratedAt: { type: Date, default: Date.now },
});

export default model<IInteractionLog>('InteractionLog', InteractionLogSchema);
