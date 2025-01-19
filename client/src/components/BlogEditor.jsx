import React, { useState } from 'react';
import { Box, Button, FormControl, Input, Textarea, VStack, useToast } from '@chakra-ui/react';

function BlogEditor({ onPublish, initialContent = '', language = 'en' }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState('');
  const toast = useToast();

  const handlePublish = () => {
    if (!title || !content) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    onPublish({
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()),
      language,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      publishedAt: new Date().toISOString(),
    });
  };

  return (
    <Box className="bg-white rounded-lg shadow-md p-6">
      <VStack spacing={4}>
        <FormControl isRequired>
          <Input
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
          />
        </FormControl>

        <FormControl isRequired>
          <Textarea
            placeholder="Blog Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minHeight="200px"
            className="mb-4"
          />
        </FormControl>

        <FormControl>
          <Input
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mb-4"
          />
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={handlePublish}
          width="full"
        >
          Publish Blog
        </Button>
      </VStack>
    </Box>
  );
}

export default BlogEditor;