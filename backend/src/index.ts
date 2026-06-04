import fs from 'fs';

// Auto-create directories on the production server to prevent Multer crashes
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('output')) fs.mkdirSync('output');

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import assignmentRoutes from './routes/assignmentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());

app.use('/api', assignmentRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
