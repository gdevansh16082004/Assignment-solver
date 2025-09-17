import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the SDK with your API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Define the model for text generation
const llmModel = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function getLLMSolution(prompt: string): Promise<string> {
    try {
        const result = await llmModel.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error('Error getting LLM solution:', error);
        throw new Error('Failed to get solution from LLM.');
    }
}