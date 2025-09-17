// import { Router } from 'express';
// import InteractionLog from '../models/InteractionLog';
// import { connectToDatabase } from '../utils/mongodb';

// const router = Router();

// router.get('/logs/:taskId', async (req, res) => {
//     await connectToDatabase();

//     const logs = await InteractionLog.find({ taskId: req.params.taskId }).sort({ submittedAt: -1 });
//     res.json(logs);
// });

// export default router;
