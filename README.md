# AI-Powered Sales Coach

This is an AI-powered sales coach application that allows users to submit their sales pitches, receive real-time feedback, and track improvements. The application leverages WebSocket technology to provide real-time communication between the frontend and backend. It also integrates with Redis for message queuing and feedback delivery.

## Features

- **Real-Time Feedback**: Receive feedback instantly after submitting a pitch.
- **WebSocket Integration**: Uses WebSocket for real-time communication between frontend and backend.
- **Redis Message Queuing**: Redis is used to queue feedback analysis and send it back to users in real time.
- **Scalable Architecture**: Backend is capable of handling multiple CPU cores via clustering.

## Tech Stack

- **Frontend**: React, Socket.io-client
- **Backend**: Node.js, Express, Socket.io, Redis, MongoDB
- **Real-Time Communication**: WebSockets
- **Redis**: For message queuing and feedback processing
- **Database**: MongoDB for storing user feedback
- **Environment Variables**: `.env` file for configuration

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version recommended)
- Redis (installed locally or use a Redis cloud service)
- MongoDB (installed locally or use a MongoDB cloud service like Atlas)
- npm or yarn (package manager)

### 1. Clone the Repository

```bash
git clone https://github.com/saurabh78crypto/sales-coach.git
cd sales-coach
```

### 2. Install Backend Dependencies

Navigate to the backend folder and install the required packages:
```bash
cd sales-coach-backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend root directory and add the following configurations:

```js
MONGO_URI = <your_mongodb_connection_string>
REDIS_HOST = localhost
REDIS_PORT = 6379
PORT = 5000
```
Replace `your_mongodb_connection_string` with your actual MongoDB connection URI.

### 4. Run Backend Server

Start the backend server:
```bash
npm start
```
The backend should now be running on `http://localhost:5000`.

### 5. Install Frontend Dependencies

```bash
cd sales-coach-frontend
npm install
```

### 6. Configure Frontend Environment Variables

Create a `.env` file in the frontend root directory and add the following configuration:
```js
REACT_APP_API_BASE_URL = http://localhost:5000
```

### 7. Run Frontend Server

Start the frontend server:
```bash
npm start
```
The frontend should now be running on `http://localhost:3000`.

### WebSocket Configuration

**Backend (Node.js with Express and Socket.io)**

The backend uses Socket.io to establish a WebSocket connection with the frontend. The WebSocket server is set up to handle requests for feedback `(requestFeedback)` and send updates to connected clients.

**Frontend (React with Socket.io-client)**

The frontend listens for real-time feedback updates and emits a request for feedback to the backend when a pitch is submitted.

### Clustering for Scalability

The backend is set up to fork multiple processes based on the number of available CPU cores, ensuring that the application can scale efficiently.

### Redis Integration

Redis is used for message queuing to handle feedback processing asynchronously. The backend subscribes to the feedbackChannel in Redis and emits updates to connected clients when feedback is available.

## How It Works

- The user submits a sales pitch via the frontend form.
- The pitch is sent to the backend via WebSocket for analysis.
- The backend processes the pitch and queues feedback analysis through Redis.
- Once the analysis is complete, feedback is sent back to the frontend in real time via WebSocket.
- The frontend displays the feedback to the user.