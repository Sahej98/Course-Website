import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: String,
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const forumThreadSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: String,
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
    upvotes: { type: Number, default: 0 },
    isResolved: { type: Boolean, default: false },
    comments: [commentSchema]
}, { timestamps: true });

export default mongoose.model('ForumThread', forumThreadSchema);