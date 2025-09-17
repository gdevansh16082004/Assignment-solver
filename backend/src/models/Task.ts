import { Schema, model, Document } from 'mongoose';

export interface ITask extends Document {
    description: string;
    status: 'Pending' | 'Embedding Done' | 'Solution Generated';
    createdAt: Date;
}

const TaskSchema = new Schema<ITask>({
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Embedding Done', 'Solution Generated'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

export default model<ITask>('Task', TaskSchema);
