import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import bcrypt from 'bcryptjs';
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

// Update User
router.put('/users/:id', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const { name, email, password, role, avatar } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.avatar = avatar || user.avatar;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create user (Admin only)
router.post('/users', protect, authorize('ADMIN'), async (req, res) => {
    const { name, email, password, role, avatar } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'STUDENT',
            avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Bulk Import Users
router.post('/users/bulk', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const users = req.body; // Expect array
        if (!Array.isArray(users)) return res.status(400).json({ message: "Invalid format" });

        const createdUsers = [];
        const salt = await bcrypt.genSalt(10);
        const defaultPasswordHash = await bcrypt.hash('password123', salt);

        for (const u of users) {
            // Skip duplicates simply
            const exists = await User.findOne({ email: u.email });
            if (exists) continue;

            const hashedPassword = u.password ? await bcrypt.hash(u.password, salt) : defaultPasswordHash;
            const newUser = await User.create({
                name: u.name,
                email: u.email,
                password: hashedPassword,
                role: u.role || 'STUDENT',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`
            });
            createdUsers.push(newUser);
        }
        res.json({ message: `Imported ${createdUsers.length} users.`, users: createdUsers });
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