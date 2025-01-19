import React from 'react';
import { Box, FormControl, FormLabel, Input, Button, VStack } from '@chakra-ui/react';

function SEOManager({ onSave }) {
  const handleSave = () => {
    const dummySEOData = {
      metaTitle: 'Dummy Meta Title',
      metaDescription: 'Dummy Meta Description',
    };
    onSave(dummySEOData);
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Meta Title</FormLabel>
        <Input placeholder="Enter meta title" defaultValue="Dummy Meta Title" />
      </FormControl>

      <FormControl>
        <FormLabel>Meta Description</FormLabel>
        <Input placeholder="Enter meta description" defaultValue="Dummy Meta Description" />
      </FormControl>

      <Button colorScheme="blue" onClick={handleSave}>
        Save SEO Settings
      </Button>
    </VStack>
  );
}

export default SEOManager;
