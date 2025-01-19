import { AssemblyAI } from 'assemblyai';

const API_BASE_URL = 'http://localhost:5000/api'; // Base URL for backend API
const client = new AssemblyAI({
  apiKey: 'bd926b4820124010914ad4b6fc2cce2c', // Replace with your AssemblyAI API key
});

/**
 * Transcribes a video file using the backend and AssemblyAI.
 * @param {File} file - The video file to process.
 * @returns {Promise<string>} - The transcription text.
 */
export const transcribeVideo = async (file) => {
  try {
    // Step 1: Send the video to the backend for audio extraction and transcription
    const formData = new FormData();
    formData.append('file', file);

    const audioFileResponse = await fetch(`${API_BASE_URL}/extract-audio`, {
      method: 'POST',
      body: formData,
    });

    if (!audioFileResponse.ok) {
      const errorData = await audioFileResponse.json();
      throw new Error(errorData.error || 'Failed to process the video file');
    }

    // Step 2: Parse the transcription result
    const result = await audioFileResponse.json();

    // Return the transcription text
    return result.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error(error.message || 'Failed to transcribe video');
  }
};


/*import { AssemblyAI } from 'assemblyai';
import { API_BASE_URL } from '../config.js'; // Import the API_BASE_URL constant

// Initialize the AssemblyAI client with your API key
const client = new AssemblyAI({
  apiKey: "bd926b4820124010914ad4b6fc2cce2c", // Replace with your actual API key
}); */