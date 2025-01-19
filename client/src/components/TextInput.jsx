import React from 'react';
import { Button, Textarea, VStack } from '@chakra-ui/react';

function TextInput({ content, onContentChange, onTranslate, isTranslating }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Content Input</h2>
      <Textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Enter your blog content here..."
        size="lg"
        minH="200px"
        className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <Button
        onClick={onTranslate}
        isLoading={isTranslating}
        loadingText="Translating..."
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
        disabled={isTranslating}
      >
        Translate to All Languages
      </Button>
    </div>
  );
}

export default TextInput;