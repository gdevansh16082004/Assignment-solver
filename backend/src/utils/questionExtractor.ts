import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import pdfParse from 'pdf-parse';
import fs from 'fs';

// Initializing the Gemini model
const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-1.5-flash-latest",
    temperature: 0.1,
});

type Question = {
    questionNumber: number;
    questionText: string;
};

// Extracting questions from a PDF using the Gemini API.
export async function splitIntoQuestionsWithGemini(filePath: string): Promise<Question[]> {
    // Extracting raw text from the PDF
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const pdfText = data.text;

    const prompt = `
        You are an expert text processing engine. Analyze the following text extracted from an academic assignment.
        Your task is to identify every distinct, numbered question.

        Return your findings as a single, valid JSON array of objects. Each object must have two keys:
        1. "questionNumber" (an integer)
        2. "questionText" (the full, clean text of the question)

        Do not include any other text, explanations, or markdown formatting outside of the JSON array.

        Here is the text:
        ---
        ${pdfText}
    `;

    try {
        console.log('Sending prompt to Gemini...');
        const response = await llm.invoke(prompt);
        const responseText = response.content.toString();

        // extracting json
        const jsonMatch = responseText.match(/\[.*\]/s);
        if (!jsonMatch) {
            throw new Error("Gemini did not return a valid JSON array. Response was: " + responseText);
        }
        
        const jsonString = jsonMatch[0];
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Failed to parse questions with Gemini:", error);
        throw new Error("Could not extract questions from the document using Gemini.");
    }
}