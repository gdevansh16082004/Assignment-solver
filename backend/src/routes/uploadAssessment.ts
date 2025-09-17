import { Router } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import Task from '../models/Task';
import { connectToDatabase } from '../utils/mongodb';

const router = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, '-' + uniqueSuffix+file.fieldname)
  }
})
const upload = multer({ storage: multer.memoryStorage() });  // Use memory storage for buffer

router.post('/', upload.single('pdf'), async (req, res) => {
    await connectToDatabase();

    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const dataBuffer = file.buffer;
    const data = await pdfParse(dataBuffer);
    const fullText = data.text;

    const newTask = new Task({
        description: fullText,
        status: 'Pending'
    });

    await newTask.save();
    res.json({ taskId: newTask._id, message: 'Assessment uploaded and saved.' });
});

export default router;
