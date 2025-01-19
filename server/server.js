// Import required modules
import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator'; // For input validation
import mongoose from 'mongoose';

// Set FFmpeg path
ffmpeg.setFfmpegPath('C:\\ffmpeg\\ffmpeg-2025-01-15-git-4f3c9f2f03-full_build\\bin\\ffmpeg.exe');

// Initialize Express app
const app = express();
const port = 5000;

// Add CORS middleware
app.use(cors());

// Middleware for parsing JSON
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// MongoDB configuration
const MONGO_URI = 'mongodb://localhost:27017/social_blog'; // Replace with your MongoDB URI
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// MongoDB connection handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB!');
});

// Define transcription schema and model
const transcriptionSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const Transcription = mongoose.model('Transcription', transcriptionSchema);

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

    // Save transcription result to MongoDB
    const newTranscription = new Transcription({ text: completedTranscript.text });
    await newTranscription.save();

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

// Define user schema and model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Add endpoint for account creation
app.post(
  '/api/create-account',
  [
    body('name').isLength({ min: 1 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
      console.error('Error creating account:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);



// Add endpoint for user login
app.post(
  '/api/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // If login is successful
      res.status(200).json({
        message: 'Login successful',
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
