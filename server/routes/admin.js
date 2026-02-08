import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all users
router.get('/users', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user
router.delete('/users/:id', protect, authorize('ADMIN'), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get admin courses view with enrollment counts
router.get('/courses', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const courses = await Course.find({}).lean();

        const coursesWithStats = await Promise.all(courses.map(async (c) => {
            const count = await User.countDocuments({ enrolledCourses: c._id });
            return {
                ...c,
                studentCount: count
            };
        }));

        res.json(coursesWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get global stats
router.get('/stats', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const courseCount = await Course.countDocuments();
        // Mock engagement % or calculate based on submissions vs users
        res.json({
            userCount,
            courseCount,
            engagement: 95
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;