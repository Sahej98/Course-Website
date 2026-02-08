import express from 'express';
import ForumThread from '../models/ForumThread.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get Leaderboard and Top Tags (Global)
router.get('/stats/global', protect, async (req, res) => {
    try {
        // Simple aggregation for top authors by thread count
        // Note: Ideally we'd also count comments, but thread count is a good proxy for now
        const leaderboard = await ForumThread.aggregate([
            { $group: { _id: "$authorName", count: { $sum: 1 }, authorId: { $first: "$authorId" } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Tags aggregation
        const tags = await ForumThread.aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({ leaderboard, tags });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single thread by ID
router.get('/thread/:id', protect, async (req, res) => {
    try {
        const thread = await ForumThread.findById(req.params.id);
        if (!thread) return res.status(404).json({ message: 'Thread not found' });
        res.json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get threads for a course
router.get('/:courseId', protect, async (req, res) => {
    try {
        const query = req.params.courseId === 'all' ? {} : { courseId: req.params.courseId };
        const threads = await ForumThread.find(query).sort({ createdAt: -1 });
        res.json(threads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a thread
router.post('/', protect, async (req, res) => {
    try {
        const { courseId, title, content, tags } = req.body;
        const thread = await ForumThread.create({
            courseId,
            authorId: req.user._id,
            authorName: req.user.name,
            title,
            content,
            tags
        });
        res.status(201).json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a comment/reply
router.post('/:id/reply', protect, async (req, res) => {
    try {
        const thread = await ForumThread.findById(req.params.id);
        if (!thread) return res.status(404).json({ message: 'Thread not found' });

        const comment = {
            authorId: req.user._id,
            authorName: req.user.name,
            content: req.body.content
        };

        thread.comments.push(comment);
        await thread.save();
        res.json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Toggle Resolve Status
router.put('/:id/resolve', protect, async (req, res) => {
    try {
        const thread = await ForumThread.findById(req.params.id);
        if (!thread) return res.status(404).json({ message: 'Thread not found' });

        thread.isResolved = !thread.isResolved;
        await thread.save();
        res.json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;