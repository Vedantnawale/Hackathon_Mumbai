import React, { useState } from 'react';
import { Box, Container, VStack, useToast } from '@chakra-ui/react';
import TextInput from './TextInput';
import VideoInput from './VideoInput';
import TranslationProgress from './TranslationProgress';
import { translateContent } from '../services/gemini';

const SUPPORTED_LANGUAGES = [
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ta', name: 'Tamil' },
  { code: 'kn', name: 'Kannada' },
  { code: 'te', name: 'Telugu' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'or', name: 'Odia' }
];

function BlogDashboard() {
  const [content, setContent] = useState('');
  const [translations, setTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  const toast = useToast();

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleTranslate = async () => {
    if (!content) {
      toast({
        title: 'Error',
        description: 'Please enter some content to translate',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsTranslating(true);
    const newTranslations = {};

    try {
      for (const lang of SUPPORTED_LANGUAGES) {
        const translated = await translateContent(content, lang.name);
        newTranslations[lang.code] = translated;
      }
      
      setTranslations(newTranslations);
      toast({
        title: 'Success',
        description: 'Content translated successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Translation failed. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <div className="w-full text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
              Multilingual Blog Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Create and translate content in 10 Indian languages
            </p>
          </div>
          
          <Box className="w-full bg-white rounded-xl shadow-lg p-6">
            <TextInput 
              content={content}
              onContentChange={handleContentChange}
              onTranslate={handleTranslate}
              isTranslating={isTranslating}
            />
          </Box>
          
          <Box className="w-full bg-white rounded-xl shadow-lg p-6">
            <VideoInput onTranscriptionComplete={handleContentChange} />
          </Box>
          
          <Box className="w-full bg-white rounded-xl shadow-lg p-6">
            <TranslationProgress 
              translations={translations}
              languages={SUPPORTED_LANGUAGES}
              isTranslating={isTranslating}
            />
          </Box>
        </VStack>
      </Container>
    </div>
  );
}

export default BlogDashboard;