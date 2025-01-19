// Import required modules
import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import cors from 'cors';

// Set FFmpeg path
ffmpeg.setFfmpegPath('C:\\ffmpeg\\ffmpeg-2025-01-15-git-4f3c9f2f03-full_build\\bin\\ffmpeg.exe');

// Initialize the Express app
const app = express();
const port = 5000;

// Add CORS middleware
app.use(cors());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Helper function to convert video to audio
const convertVideoToAudio = (videoPath, audioPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioPath)
      .on('end', () => resolve(audioPath))
      .on('error', (error) => reject(error))
      .run();
  });
};

// AssemblyAI API configuration
const ASSEMBLYAI_API_KEY = 'bd926b4820124010914ad4b6fc2cce2c'; // Replace with your API key
const ASSEMBLYAI_BASE_URL = 'https://api.assemblyai.com/v2';

// Helper function to upload audio to AssemblyAI
const uploadAudioToAssemblyAI = async (audioPath) => {
  try {
    const audioData = fs.readFileSync(audioPath);
    const response = await axios.post(
      `${ASSEMBLYAI_BASE_URL}/upload`,
      audioData,
      {
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
          'content-type': 'application/octet-stream',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to upload audio to AssemblyAI: ' + error.message);
  }
};

// Helper function to request transcription
const requestTranscription = async (audioUrl) => {
  try {
    const response = await axios.post(
      `${ASSEMBLYAI_BASE_URL}/transcript`,
      {
        audio_url: audioUrl,
        language_code: 'en',
        punctuate: true,
        format_text: true,
      },
      {
        headers: { authorization: ASSEMBLYAI_API_KEY },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to request transcription: ' + error.message);
  }
};

// Helper function to poll transcription status
const waitForTranscription = async (transcriptId) => {
  const pollingUrl = `${ASSEMBLYAI_BASE_URL}/transcript/${transcriptId}`;

  while (true) {
    try {
      const response = await axios.get(pollingUrl, {
        headers: { authorization: ASSEMBLYAI_API_KEY },
      });

      if (response.data.status === 'completed') {
        return response.data;
      }

      if (response.data.status === 'error') {
        throw new Error(response.data.error);
      }

      // Wait 5 seconds before polling again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      throw new Error('Error polling transcription status: ' + error.message);
    }
  }
};

// Define the /api/extract-audio endpoint
app.post('/api/extract-audio', upload.single('file'), async (req, res) => {
  const cleanupFiles = (paths) => {
    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  };

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const videoPath = path.normalize(req.file.path);
    const audioPath = path.normalize(`uploads/${path.parse(req.file.filename).name}.mp3`);

    // Convert video to audio
    await convertVideoToAudio(videoPath, audioPath);

    // Upload audio to AssemblyAI
    const uploadResponse = await uploadAudioToAssemblyAI(audioPath);

    if (!uploadResponse || !uploadResponse.upload_url) {
      throw new Error('Failed to upload audio to AssemblyAI.');
    }

    // Request transcription
    const transcript = await requestTranscription(uploadResponse.upload_url);

    // Wait for transcription to complete
    const completedTranscript = await waitForTranscription(transcript.id);

    // Clean up temporary files
    cleanupFiles([videoPath, audioPath]);

    res.json({ text: completedTranscript.text });
  } catch (error) {
    console.error('Error processing file:', error);

    // Cleanup temporary files on error
    const videoPath = req.file ? path.normalize(req.file.path) : null;
    const audioPath = req.file
      ? path.normalize(`uploads/${path.parse(req.file.filename).name}.mp3`)
      : null;

    cleanupFiles([videoPath, audioPath]);

    res.status(500).json({ error: error.message || 'Internal server error.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
