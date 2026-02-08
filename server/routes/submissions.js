import express from 'express';
import Submission from '../models/Submission.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get ALL my submissions (across all courses)
router.get('/my', protect, async (req, res) => {
    try {
        const submissions = await Submission.find({ studentId: req.user._id });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get my submissions for a specific course
router.get('/my/:courseId', protect, async (req, res) => {
    try {
        const submissions = await Submission.find({
            studentId: req.user._id,
            courseId: req.params.courseId
        });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// TEACHER: Get all submissions for a specific course
router.get('/course/:courseId', protect, authorize('TEACHER', 'ADMIN'), async (req, res) => {
    try {
        // populate student details to show name
        const submissions = await Submission.find({ courseId: req.params.courseId })
            .populate('studentId', 'name email avatar');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// TEACHER: Grade a submission
router.put('/:id/grade', protect, authorize('TEACHER', 'ADMIN'), async (req, res) => {
    try {
        const { grade, feedback } = req.body;
        const submission = await Submission.findById(req.params.id);

        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        submission.grade = grade;
        submission.feedback = feedback;
        submission.status = 'graded';

        await submission.save();
        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Submit an assignment
router.post('/', protect, async (req, res) => {
    const { courseId, assignmentId, content } = req.body;

    try {
        const existing = await Submission.findOne({
            studentId: req.user._id,
            courseId,
            assignmentId
        });

        if (existing) {
            existing.content = content;
            existing.status = 'submitted'; // reset status if re-submitted
            const updated = await existing.save();
            return res.json(updated);
        }

        const submission = await Submission.create({
            courseId,
            assignmentId,
            studentId: req.user._id,
            content
        });

        res.status(201).json(submission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;