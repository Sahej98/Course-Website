import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    title: String,
    type: { type: String, enum: ['video', 'pdf', 'link', 'ppt'] },
    url: String
});

const moduleSchema = new mongoose.Schema({
    id: String,
    title: String,
    resources: [resourceSchema]
});

const questionSchema = new mongoose.Schema({
    id: String,
    type: { type: String, enum: ['text', 'mcq'], default: 'text' },
    questionText: String,
    options: [String], // For MCQ
    correctOption: Number, // Index of correct option (optional for auto-grade)
    points: { type: Number, default: 10 }
});

const assignmentSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    dueDate: String,
    totalPoints: Number,
    antiCheat: { type: Boolean, default: false },
    timeLimit: { type: Number, default: 0 }, // in minutes
    questions: [questionSchema] // Added structured questions
});

const quizSchema = new mongoose.Schema({
    id: String,
    title: String,
    totalPoints: Number,
    questions: [{
        id: String,
        questionText: String,
        options: [String],
        correctOptionIndex: Number,
        explanation: String
    }],
    antiCheat: { type: Boolean, default: false },
    timeLimit: { type: Number, default: 0 }
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    instructor: String, // Display name
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to user
    thumbnail: String,
    progress: { type: Number, default: 0 },
    modules: [moduleSchema],
    assignments: [assignmentSchema],
    quizzes: [quizSchema]
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);