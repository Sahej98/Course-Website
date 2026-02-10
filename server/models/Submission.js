import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    assignmentId: { type: String, required: true }, // Linking to the embedded assignment ID string
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String }, // Legacy or general comments
    answers: [{
        questionId: String,
        answer: mongoose.Schema.Types.Mixed // String for text, Number index for MCQ
    }],
    grade: { type: Number, default: null },
    feedback: { type: String, default: '' },
    status: { type: String, enum: ['submitted', 'graded', 'pending'], default: 'submitted' },
    resubmissionRequested: { type: Boolean, default: false }
}, { timestamps: true });

// Ensure a student can only submit once per assignment
submissionSchema.index({ courseId: 1, assignmentId: 1, studentId: 1 }, { unique: true });

export default mongoose.model('Submission', submissionSchema);