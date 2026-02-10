import express from 'express';
import Submission from '../models/Submission.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get ALL my submissions
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
        submission.resubmissionRequested = false;

        await submission.save();

        // Notify Student
        await Notification.create({
            userId: submission.studentId,
            message: `Your assignment has been graded: ${grade} points.`,
            type: 'success',
            link: '/assignments'
        });

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Submit an assignment
router.post('/', protect, async (req, res) => {
    const { courseId, assignmentId, content, answers } = req.body;

    try {
        const existing = await Submission.findOne({
            studentId: req.user._id,
            courseId,
            assignmentId
        });

        if (existing) {
            if (content) existing.content = content;
            if (answers) existing.answers = answers;
            existing.status = 'submitted'; // reset status if re-submitted
            existing.resubmissionRequested = false;
            const updated = await existing.save();
            return res.json(updated);
        }

        const submission = await Submission.create({
            courseId,
            assignmentId,
            studentId: req.user._id,
            content,
            answers
        });

        res.status(201).json(submission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Request Resubmission
router.post('/:id/request-resubmit', protect, async (req, res) => {
    try {
        const submission = await Submission.findOne({ _id: req.params.id, studentId: req.user._id });
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        submission.resubmissionRequested = true;
        await submission.save();
        res.json({ message: 'Request sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Approve Resubmission
router.post('/:id/approve-resubmit', protect, authorize('TEACHER', 'ADMIN'), async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        submission.status = 'pending'; // Allow resubmit
        submission.resubmissionRequested = false;
        await submission.save();

        // Notify Student
        await Notification.create({
            userId: submission.studentId,
            message: `Resubmission approved for your assignment.`,
            type: 'info',
            link: '/assignments'
        });

        res.json({ message: 'Resubmission approved' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;