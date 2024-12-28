import Redis from 'ioredis';
import { loadModel } from './modelLoader.js';
import { logMessage } from '../utils/logger.js';

// Initialize Redis client with reconnect strategy
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    retryStratergy: (times) => {
        if(times >= 10) {
            return new Error('Redis connection failed after multiple retries.')
        }
        return Math.min(times * 100, 3000); // Retry after 100ms, up to 3 seconds 
    }
});

// Handle Redis client events
redisClient.on('error', (error) => {
    console.error('Redis error:', error);
})

redisClient.on('end', (error) => {
    console.log('Redis connection closed');
});

redisClient.on('connect', (error) => {
    console.log('Connected to Redis');
});

async function analyzePitch(pitch) {
    try {
        // Check cache
        const cachedFeedback = await redisClient.get(pitch);
        
        if(cachedFeedback) {
            console.log('Returning cached feedback');
            return JSON.parse(cachedFeedback);
        }

        const model = await loadModel();
        const analysisResult = await model(pitch); // Run sentiment analysis
        const sentiment = analysisResult[0].label; // e.g., 'POSITIVE' or 'NEGATIVE'
        const confidenceScore = analysisResult[0].score; // Confidence score (0-1)
        
        const feedback = {
            pitch,
            sentiment,
            clarity: sentiment === 'POSITIVE' ? 'Clear' : 'Needs Improvement',
            confidence: confidenceScore > 0.7 ? 'Confident' : 'Uncertain'
        };

        // Cache the result for future use
        await redisClient.set(pitch, JSON.stringify(feedback), 'EX', 3600); // Cache for 1 hour

        logMessage(`Feedback generated for pitch: ${JSON.stringify(feedback)}`);
        return feedback;
    } catch (error) {
        logMessage(`Error in analyzing pitch: ${error.message}`, 'ERROR');
        throw error;
    }
}

export { analyzePitch };
