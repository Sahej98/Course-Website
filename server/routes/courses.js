import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all courses (Public/Protected)
router.get('/', protect, async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single course
router.get('/:id', protect, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Enroll in a course (Students only)
router.post('/:id/enroll', protect, async (req, res) => {
    try {
        if (req.user.role === 'TEACHER') {
            return res.status(403).json({ message: 'Instructors cannot enroll in courses.' });
        }

        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const user = await User.findById(req.user._id);
        if (user.enrolledCourses.includes(course._id)) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        user.enrolledCourses.push(course._id);
        await user.save();

        res.json({ message: 'Enrolled successfully', courseId: course._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Course (Instructor/Admin only)
router.post('/', protect, authorize('TEACHER', 'ADMIN'), async (req, res) => {
    try {
        // Automatically set instructor if not provided
        const courseData = {
            ...req.body,
            instructor: req.user.name,
            instructorId: req.user._id
        };
        const course = new Course(courseData);
        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Bulk Import Courses
router.post('/bulk', protect, authorize('TEACHER', 'ADMIN'), async (req, res) => {
    try {
        const courses = req.body; // Expects array of course objects
        if (!Array.isArray(courses)) return res.status(400).json({ message: "Invalid data format. Expected array." });

        const createdCourses = [];
        for (const c of courses) {
            const courseData = {
                ...c,
                instructor: req.user.name,
                instructorId: req.user._id,
                thumbnail: c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
            };
            const newCourse = await Course.create(courseData);
            createdCourses.push(newCourse);
        }
        res.status(201).json(createdCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Course
router.put('/:id', protect, authorize('TEACHER', 'ADMIN'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            // Verify ownership if not admin
            if (req.user.role !== 'ADMIN' && course.instructorId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this course' });
            }

            Object.assign(course, req.body);
            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Course
router.delete('/:id', protect, authorize('TEACHER', 'ADMIN'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            // Verify ownership if not admin
            if (req.user.role !== 'ADMIN' && course.instructorId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this course' });
            }

            await Course.deleteOne({ _id: req.params.id });
            res.json({ message: 'Course removed' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;