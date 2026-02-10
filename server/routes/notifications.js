import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
    try {
        const notes = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id/read', protect, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;