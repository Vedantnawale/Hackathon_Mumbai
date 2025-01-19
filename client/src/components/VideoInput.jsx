import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import { transcribeVideo } from '../services/assemblyai';
import { useToast } from '@chakra-ui/react';

function VideoInput({ onTranscriptionComplete }) {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const toast = useToast();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        title: "File too large",
        description: "Please upload a video file smaller than 100MB",
        status: "error",
        duration: 5000,
      });
      return;
    }

    setIsTranscribing(true);
    toast({
      title: "Video uploaded successfully",
      description: "Starting transcription process...",
      status: "success",
      duration: 3000,
    });

    try {
      const transcription = await transcribeVideo(file);
      if (transcription) {
        onTranscriptionComplete(transcription);
        toast({
          title: "Transcription completed",
          description: "Your video has been transcribed successfully",
          status: "success",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Transcription failed",
        description: error.message || "Failed to transcribe video. Please try again.",
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsTranscribing(false);
    }
  }, [onTranscriptionComplete, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov'],
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false,
    disabled: isTranscribing
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Video/Audio Upload</h2>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors duration-300 ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
        } ${isTranscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <FiUpload className="mx-auto text-4xl text-gray-400" />
          <p className="text-gray-600">
            {isTranscribing ? 'Transcribing...' :
              isDragActive ? 'Drop the file here...' :
              'Drag and drop a video or audio file here, or click to select'}
          </p>
          <p className="text-sm text-gray-500">
            Supported formats: MP4, MOV, MP3, WAV, M4A (Max size: 100MB)
          </p>
        </div>
      </div>
      {isTranscribing && (
        <div className="mt-4">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-pulse"></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Transcribing your file... This may take a few minutes.
          </p>
        </div>
      )}
    </div>
  );
}

export default VideoInput;