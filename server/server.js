import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import submissionRoutes from './routes/submissions.js';
import forumRoutes from './routes/forum.js';
import analyticsRoutes from './routes/analytics.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// DB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edusphere')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => res.send('EduSphere API Running'));
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});