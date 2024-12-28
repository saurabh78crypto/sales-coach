import express from 'express';
import { queueFeedbackAnalysis } from '../services/queueService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { pitch } = req.body;
        if (!pitch) {
            return res.status(400).json({ error: 'Pitch is required.' });
        }

        // Queue feedback analysis
        await queueFeedbackAnalysis(pitch);

        return res.status(200).json({ message: 'Feedback analysis queued. You will receive results shortly.' });
    } catch (error) {
        console.error('Error analyzing pitch:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
