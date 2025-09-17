import { Router } from 'express';
import multer from 'multer';
import path from 'path';
// 🧠 Import the new Gemini-powered function
import { extractTextFromPDF, generateAnswersPDF, splitIntoQuestionsWithGemini } from '../utils/pdfUtils';
// 🧠 Import the new parallel processing function
import { processAllQuestionsInParallel } from '../utils/solverUtils';
import { Request, Response } from 'express';
import fs from 'fs';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('pdf'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'PDF file is required' });
        }

        const pdfFilePath = req.file.path;
        const pdfText = await extractTextFromPDF(pdfFilePath);
        
        // ✅ Use the more robust Gemini function to split questions
        const questionsArray = await splitIntoQuestionsWithGemini(pdfText);
        
        // ✅ Process all questions in parallel for much better performance
        const solvedResults = await processAllQuestionsInParallel(questionsArray);

        const outputFileName = `assignment-answers-${Date.now()}.pdf`;
        const outputFilePath = path.join(__dirname, '../../output', outputFileName);

        // Ensure output directory exists
        const outputDir = path.dirname(outputFilePath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Wait for PDF to be generated
        await generateAnswersPDF(solvedResults, outputFilePath);

        // Remove uploaded file after processing
        fs.unlinkSync(pdfFilePath);

        return res.download(outputFilePath, 'assignment-answers.pdf', (err) => {
            if (err) console.error("Error sending file:", err);
            // Clean up the generated output file after download is complete
            fs.unlinkSync(outputFilePath);
        });
    } catch (error) {
        console.error("Error in processing request:", error);
        return res.status(500).json({ error: 'Error while solving assignment' });
    }
});

export default router;