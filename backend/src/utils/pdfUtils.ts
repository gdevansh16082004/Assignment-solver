import fs from 'fs';
import pdfParse from 'pdf-parse';
import PDFDocument from 'pdfkit';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Gemini SDK Setup ---
// This is needed for the splitIntoQuestionsWithGemini function.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
const MODEL_NAME = 'gemini-1.5-flash-latest';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });


// --- PDF Utility Functions ---

export async function extractTextFromPDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
}

/**
 * Uses the Gemini API to intelligently split text into an array of questions.
 */
export async function splitIntoQuestionsWithGemini(pdfText: string): Promise<{ questionNumber: number, questionText: string }[]> {
    const prompt = `
        You are an intelligent text processing engine. I will provide you with a block of text extracted from a document. Your task is to identify and extract all the individual questions from this text.

        Please handle various numbering formats (e.g., '1.', 'Q1)', 'a.', etc.).

        Your output MUST be a valid JSON array of objects. Each object in the array should have two keys: "questionNumber" (an integer starting from 1) and "questionText" (the full, clean text of the question).

        Do not include any other text, explanations, or markdown formatting in your response. Only output the raw JSON array.

        Here is the text:
        ---
        ${pdfText}
    `;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const questions = JSON.parse(cleanedJson);
        return questions;
    } catch (error) {
        console.error("Failed to parse questions with Gemini:", error);
        return []; 
    }
}

export function generateAnswersPDF(
    results: { questionNumber: number; questionText: string; answer: string }[],
    outputFilePath: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(outputFilePath);

        doc.pipe(writeStream);

        doc.fontSize(20).text('Assignment Solver - Answers', { align: 'center' });
        doc.moveDown();

        results.forEach(({ questionNumber, questionText, answer }, index) => {
            doc.fontSize(14).font('Helvetica-Bold').text(`Question ${questionNumber}:`, { underline: true });
            doc.font('Helvetica').fontSize(12).text(questionText);
            doc.moveDown(0.5);
            doc.fontSize(14).font('Helvetica-Bold').text('Answer:', { underline: true });
            doc.font('Helvetica').fontSize(12).text(answer);
            
            // Add a new page for all but the last entry
            if (index < results.length - 1) {
                doc.addPage();
            }
        });

        doc.end();

        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}