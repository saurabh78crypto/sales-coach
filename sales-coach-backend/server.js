import cluster from 'cluster';
import os from 'os';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Redis from 'ioredis';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import feedbackRoutes from './routes/feedbackRoute.js';
import { queueFeedbackAnalysis } from './services/queueService.js';

dotenv.config();

if(cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(`Primary process started. Forking for ${numCPUs} CPUs...`);

    for(let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Starting a new worker...`);
        cluster.fork();
    });
} else {

    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
            credentials: true
        },
        transports: ['websocket', 'polling']
    }); 

    const {PORT, REDIS_HOST, REDIS_PORT} = process.env;
    const redisSubscriber = new Redis({ host: REDIS_HOST, port: REDIS_PORT });

    // Connect to MongoDB
    connectDB();

    // Middleware
    app.use(bodyParser.json());
    app.use(cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }));

    // Routes
    app.use('/api/feedback', feedbackRoutes);

    // WebSocket setup
    io.on('connection', (socket) => {
        console.log(`Client conneected: ${socket.id}`);
        
        // Send real-time feedback updates
        socket.on('requestFeedback', (pitch) => {
            // Queue the feedback analysis
            queueFeedbackAnalysis(pitch)
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    // Subscribe to Redis feedback channel and emit updates via WebSocket
    redisSubscriber.subscribe('feedbackChannel', (err, count) => {
        if (err) {
            console.error('Failed to subscribe to Redis channel:', err);
            return;
        }

        console.log(`Subscribed to ${count} channel(s)`);
    });

    redisSubscriber.on('message', (channel, message) => {
        if (channel === 'feedbackChannel') {
            const feedback = JSON.parse(message);
            console.log('Received feedback:', feedback);

            // Emit feedback to all connected clients
            io.emit('feedbackUpdate', feedback);
        }
    });

    // Server
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
