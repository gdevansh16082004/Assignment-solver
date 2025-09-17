import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env');
}

export async function connectToDatabase() {
    if (mongoose.connections[0].readyState) {
        return;
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected');
}
