import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        publicId: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
