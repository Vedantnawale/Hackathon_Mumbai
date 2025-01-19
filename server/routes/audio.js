import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/api/extract-audio', upload.single('file'), async (req, res) => {
  try {
    const videoPath = req.file.path;
    const audioPath = path.join('uploads', `${path.parse(req.file.originalname).name}.mp3`);

    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .output(audioPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    res.sendFile(audioPath, (err) => {
      if (err) throw err;
      fs.unlinkSync(videoPath);
      fs.unlinkSync(audioPath);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to extract audio' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
