import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    pitch: { 
        type: String, 
        required: true,
        index: true 
    },
    sentiment: { 
        type: String, 
        required: true 
    },
    clarity: { 
        type: String, 
        required: true 
    },
    confidence: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now,
        index: true 
    },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
