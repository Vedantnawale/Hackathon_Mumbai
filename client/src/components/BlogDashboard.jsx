import React, { useState } from 'react';
import { Box, Container, VStack, useToast, Select, Button, Textarea } from '@chakra-ui/react';
import TextInput from './TextInput';
import VideoInput from './VideoInput';
import BlogEditor from './BlogEditor';
import BlogPreview from './BlogPreview';
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

function BlogDashboard({ onPublish }) {
  const [content, setContent] = useState('');
  const [translations, setTranslations] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [editableTranslation, setEditableTranslation] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [blogData, setBlogData] = useState(null);
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
      setSelectedLanguage(SUPPORTED_LANGUAGES[0].code);
      setEditableTranslation(newTranslations[SUPPORTED_LANGUAGES[0].code]);
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

  const handleLanguageChange = (event) => {
    const selectedLang = event.target.value;
    setSelectedLanguage(selectedLang);
    setEditableTranslation(translations[selectedLang] || '');
  };

  const handleEditableTranslationChange = (event) => {
    setEditableTranslation(event.target.value);
  };

  const handleShare = () => {
    setShowEditor(true);
  };

  const handleEditorSubmit = (data) => {
    setBlogData({
      ...data,
      content: editableTranslation,
      language: selectedLanguage
    });
    setShowEditor(false);
    setShowPreview(true);
  };

  const handlePublish = () => {
    onPublish(blogData);
    setShowPreview(false);
    toast({
      title: 'Published!',
      description: 'Your blog has been published successfully.',
      status: 'success',
      duration: 3000,
    });
  };

  if (showPreview) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <BlogPreview blog={blogData} />
          <Button colorScheme="blue" onClick={handlePublish}>
            Publish Blog
          </Button>
          <Button onClick={() => setShowPreview(false)}>
            Back to Editor
          </Button>
        </VStack>
      </Container>
    );
  }

  if (showEditor) {
    return (
      <Container maxW="container.xl" py={8}>
        <BlogEditor
          initialContent={editableTranslation}
          language={selectedLanguage}
          onPublish={handleEditorSubmit}
        />
        <Button mt={4} onClick={() => setShowEditor(false)}>
          Back to Translation
        </Button>
      </Container>
    );
  }

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
            <h2 className="text-xl font-semibold text-gray-800">Translations</h2>

            <Select placeholder="Select Language" value={selectedLanguage} onChange={handleLanguageChange} mt={4}>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </Select>

            {selectedLanguage && (
              <Textarea
                value={editableTranslation}
                onChange={handleEditableTranslationChange}
                mt={4}
                minH="150px"
                placeholder="Translated text will appear here..."
              />
            )}

            <Button
              mt={4}
              colorScheme="blue"
              onClick={handleShare}
              isDisabled={!editableTranslation}
            >
              Continue to Editor
            </Button>
          </Box>

          <Box className="w-full bg-white rounded-xl shadow-lg p-6">
            <VideoInput onTranscriptionComplete={handleContentChange} />
          </Box>
        </VStack>
      </Container>
    </div>
  );
}

export default BlogDashboard;