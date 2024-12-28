import React from "react";

const FeedbackDisplay = ({ feedback }) => {
    return (
        <div className="feedback-display">
            <h3>Real-Time Feedback</h3>
            {feedback ? (
                <ul>
                    <li><strong>Sentiment:</strong> {feedback.sentiment}</li>
                    <li><strong>Clarity:</strong> {feedback.clarity}</li>
                    <li><strong>Confidence:</strong> {feedback.confidence}</li>
                </ul>
            ) : (
                <p>No feedback available yet. Submit a pitch to see results!</p>
            )}
        </div>
    );
};


export default FeedbackDisplay;