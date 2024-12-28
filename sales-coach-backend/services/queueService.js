import Bull from "bull";
import { analyzePitch } from "./analysisService.js";
import Feedback from "../models/feedback.js";
import Redis from "ioredis";

const { REDIS_HOST, REDIS_PORT } = process.env;
// Initialize the Redis-backend queue
const feedbackQueue = new Bull('feedbackQueue', {
    redis: { host: REDIS_HOST, port: REDIS_PORT },
});

// Initialize Redis pub/sub (to send message between worker and main process)
const redisPublisher = new Redis({ host: REDIS_HOST, port: REDIS_PORT });

// Process feedback queue
feedbackQueue.process(async (job) => {
    const { pitch } = job.data;
    
    const feedback = await analyzePitch(pitch);

    try {
        // Save feedback to the database
        const savedFeedback = await Feedback.create(feedback);

        // Publish feedback to Redis channel
        redisPublisher.publish('feedbackChannel', JSON.stringify(feedback), (err, reply) => {
            if(err){
                console.error('Error publishing feedback to Redis channel:', err);
            } else {
                console.log('Feedback published to Redis channel:', reply);
            }
        });
        
    } catch (error) {
        console.error('Error saving feedback to database:', error);
    }

    console.log('Job completed:', job.id);
});

// Queue feedback analysis
async function queueFeedbackAnalysis(pitch) {
    await feedbackQueue.add({ pitch });
}

export { queueFeedbackAnalysis };