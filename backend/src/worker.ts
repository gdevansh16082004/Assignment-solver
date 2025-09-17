import { Worker } from 'bullmq';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { generateFormattedPDF } from './services/pdfService'; 
import { splitIntoQuestionsWithGemini } from './utils/questionExtractor';

const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-1.5-flash-latest",
});

const connection = { host: '127.0.0.1', port: 6379 };

const worker = new Worker('assignment-processing', async job => {
    const { filePath } = job.data;
    console.log(`Processing job ${job.id} for file: ${filePath}`);

    try {
        console.log('Extracting questions...');
        await job.updateProgress(10);
        const questions = await splitIntoQuestionsWithGemini(filePath);
        if (!questions || questions.length === 0) {
            throw new Error("No questions were extracted from the document.");
        }
        await job.updateProgress(30);
        
        console.log(`Solving ${questions.length} questions in a batch...`);
        const batchSolvePrompt = `
            You are an expert-level Academic Assistant Agent. Below is a JSON array of academic questions.

            Your task is to solve every question and provide a comprehensive, step-by-step solution for each one.

            IMPORTANT FORMATTING RULES:
            1. For each question, first state the full question text.
            2. Then, provide your answer.
            3. Format all mathematical notation in your answers using standard LaTeX, enclosed in double dollar signs ($$).
            4. Use a clear separator "---" between each question-answer pair.

            Here is the array of questions to solve:
            ---
            ${JSON.stringify(questions, null, 2)}
        `;

        const response = await llm.invoke(batchSolvePrompt);
        const solvedText = response.content.toString();
        await job.updateProgress(95);

        // generating pdf
        const outputFileName = `${path.basename(filePath)}-solved.pdf`;
        const outputFilePath = path.join('output', outputFileName);

        await generateFormattedPDF(solvedText, outputFilePath);
        await job.updateProgress(100);

        console.log(`Job ${job.id} completed. Output at: ${outputFilePath}`);
        fs.unlinkSync(filePath);
        return { outputFilePath };

    } catch (error) {
        console.error(`Job ${job.id} failed`, error);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw error;
    }
}, { connection });

console.log('Worker is listening for jobs...');