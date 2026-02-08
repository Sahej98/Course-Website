import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Course from './models/Course.js';
import User from './models/User.js';
import ForumThread from './models/ForumThread.js';
import Submission from './models/Submission.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edusphere');
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Course.deleteMany({}),
            ForumThread.deleteMany({}),
            Submission.deleteMany({})
        ]);

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        const teacher = await User.create({
            name: 'Dr. Bob Teacher',
            email: 'teacher@edu.com',
            password,
            role: 'TEACHER',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
        });

        const student = await User.create({
            name: 'Alice Student',
            email: 'student@edu.com',
            password,
            role: 'STUDENT',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
        });

        const admin = await User.create({
            name: 'Charlie Admin',
            email: 'admin@edu.com',
            password,
            role: 'ADMIN',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie'
        });

        console.log('Users Created');

        // Create Courses
        const courses = await Course.insertMany([
            {
                title: 'Advanced Web Development',
                description: 'Master modern web technologies including React, Node.js, and Cloud Computing.',
                instructor: teacher.name,
                instructorId: teacher._id,
                thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                progress: 0,
                modules: [
                    {
                        id: 'm1',
                        title: 'Week 1: React Fundamentals',
                        resources: [
                            { title: 'Intro to Components', type: 'video', url: '#' },
                            { title: 'State & Props Guide', type: 'pdf', url: '#' }
                        ]
                    },
                    {
                        id: 'm2',
                        title: 'Week 2: Advanced Hooks',
                        resources: [
                            { title: 'UseEffect Deep Dive', type: 'video', url: '#' }
                        ]
                    }
                ],
                assignments: [
                    { id: 'a1', title: 'Build a Todo App', description: 'Create a fully functional todo list.', dueDate: '2023-11-15', totalPoints: 100 },
                    { id: 'a2', title: 'Weather API Integration', description: 'Fetch data from an external API.', dueDate: '2023-11-22', totalPoints: 100 }
                ],
                quizzes: [
                    {
                        id: 'q1',
                        title: 'React Basics Quiz',
                        totalPoints: 20,
                        questions: [
                            {
                                id: 'qq1',
                                questionText: 'What hook is used for side effects?',
                                options: ['useState', 'useEffect', 'useContext', 'useReducer'],
                                correctOptionIndex: 1,
                                explanation: 'useEffect is designed for handling side effects in functional components.'
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Data Structures & Algorithms',
                description: 'Deep dive into algorithmic complexity, trees, graphs, and dynamic programming.',
                instructor: teacher.name,
                instructorId: teacher._id,
                thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                progress: 0,
                modules: [
                    { id: 'm1', title: 'Arrays & Strings', resources: [] }
                ],
                assignments: [],
                quizzes: []
            }
        ]);

        console.log('Courses Created');

        // Enroll student in one course for demo
        student.enrolledCourses.push(courses[0]._id);
        await student.save();

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();