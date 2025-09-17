import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Shared Constants and SDK Setup ---

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
const MODEL_NAME = 'gemini-1.5-flash-latest'; 

// Setup for the original axios function
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

// 🧠 SDK setup for the new Gemini function
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });


// --- Original axios-based function ---

export async function getAnswer(questionText: string): Promise<string> {
    try {
        const response = await axios.post(
            API_URL,
            // Correct request body structure
            {
                contents: [{
                    parts: [{
                        text: questionText
                    }]
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Correct path to the generated text in the response
        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Sorry, I couldn't get an answer.";
    }
}

// --- New function to split questions using the Gemini SDK ---

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

        // Clean the response to ensure it's valid JSON
        // Models can sometimes wrap JSON in markdown backticks
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        // Parse the JSON string into an actual JavaScript array
        const questions = JSON.parse(cleanedJson);
        
        return questions;
    } catch (error) {
        console.error("Failed to parse questions with Gemini:", error);
        // Fallback or throw an error
        return []; 
    }
}

export async function processAllQuestionsInParallel(
    questionsArray: { questionNumber: number; questionText: string }[]
): Promise<{ questionNumber: number; questionText: string; answer: string }[]> {
    
    // Create an array of promises, where each promise resolves to a solved question
    const promises = questionsArray.map(async (q) => {
        const answer = await getAnswer(q.questionText);
        return {
            questionNumber: q.questionNumber,
            questionText: q.questionText,
            answer
        };
    });

    // Wait for all promises to resolve
    return Promise.all(promises);
}