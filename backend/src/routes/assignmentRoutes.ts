import { Router } from 'express';
import multer from 'multer';
import { Queue } from 'bullmq';
import path from 'path';
import fs from 'fs';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,uniqueSuffix+file.originalname)
  }
})

const upload = multer({ storage: storage });

// Initializing the queue connection
const assignmentQueue = new Queue('assignment-processing', {
    connection: { host: '127.0.0.1', port: 6379 }   
});

// Endpoint to submit a new job
router.post('/solve-assignment', upload.single('assignmentFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded.' });
    }
    const job = await assignmentQueue.add('solve', { filePath: req.file.path });
    res.status(202).json({ jobId: job.id });
});

// Endpoint to check job status
router.get('/status/:jobId', async (req, res) => {
    const { jobId } = req.params;
    const job = await assignmentQueue.getJob(jobId);

    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }
    
    const state = await job.getState();
    const progress = job.progress;
    const result = job.returnvalue;
    const failedReason = job.failedReason;

    res.json({ id: job.id, state, progress, result, failedReason });
});

// Endpoint to download the final file
router.get('/download/:fileName', (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(process.cwd(), 'output', fileName);

    if (fs.existsSync(filePath)) {
        res.download(filePath, (err) => {
            if (err) console.error("Download error:", err);
            // Cleaning up
            fs.unlinkSync(filePath);
        });
    } else {
        res.status(404).json({ error: 'File not found.' });
    }
});

export default router;