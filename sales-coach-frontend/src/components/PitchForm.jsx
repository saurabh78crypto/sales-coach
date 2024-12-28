import React, { useState } from 'react';
import { submitPitch } from '../services/api';

const PitchForm = ({ onFeedbackQueued }) => {
    const [pitch, setPitch] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await submitPitch(pitch);
            onFeedbackQueued(response.message, pitch);
            setPitch('');
        } catch (error) {
            alert('Failed to submit pitch. Please try again.' );
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className='pitch-form'>
            <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder='Enter your sales pitch here...'
                required
            />

            <button type='submit' disabled={loading || !pitch}>
                {loading ? 'Submitting...' : 'Submit Pitch'}
            </button>
        </form>
    );
};


export default PitchForm;