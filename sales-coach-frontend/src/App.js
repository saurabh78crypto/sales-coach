import React, { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';
import PitchForm from "./components/PitchForm";
import FeedbackDisplay from "./components/FeedbackDisplay";
import './App.css'

const App = () => {
  const [feedback, setFeedback] = useState(null);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);
  
  useEffect(() => {
    // Initialize the socket connection
    socketRef.current = io(process.env.REACT_APP_API_BASE_URL, {
      transports: ['websocket', 'polling'],
    });

    // Listen for feedback updates
    socketRef.current.on('feedbackUpdate', (data) => {
      console.log('Received deedback:', data);
      setFeedback(data);
      setMessage('Feedback received!');
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleFeedbackQueued = (message, pitch) => {
    setMessage(message);
    socketRef.current.emit('requestFeedback', pitch);
  };

  return (
    <div className="app">
      <h1>AI-Powered Sales Coach</h1>
      <PitchForm onFeedbackQueued={handleFeedbackQueued} />
      <p>{message}</p>
      <FeedbackDisplay feedback={feedback} />
    </div>
  );
};


export default App;