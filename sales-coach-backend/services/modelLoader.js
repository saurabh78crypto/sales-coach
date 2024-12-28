import { pipeline } from '@huggingface/transformers';

let sentimentAnalyzer;

async function loadModel() {
    if (!sentimentAnalyzer) {
        console.log('Loading Hugging Face sentiment analysis model...');
        sentimentAnalyzer = pipeline('sentiment-analysis'); // Sentiment analysis pipeline
        console.log('Model loaded successfully.');
    }
    return sentimentAnalyzer;
}

export { loadModel };
