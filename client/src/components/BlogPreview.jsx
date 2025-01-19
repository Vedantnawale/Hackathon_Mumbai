import React from 'react';
import { Box, Heading, Text, Tag, HStack, VStack } from '@chakra-ui/react';

function BlogPreview({ blog }) {
  return (
    <Box className="bg-white rounded-lg shadow-md p-6 mb-4">
      <VStack align="start" spacing={3}>
        <Heading as="h2" size="lg">{blog.title}</Heading>
        
        <HStack spacing={2}>
          {blog.tags.map((tag, index) => (
            <Tag key={index} colorScheme="blue" size="sm">
              {tag}
            </Tag>
          ))}
        </HStack>

        <Text className="text-gray-600">
          {blog.content.substring(0, 200)}...
        </Text>

        <Text className="text-sm text-gray-500">
          Published: {new Date(blog.publishedAt).toLocaleDateString()}
        </Text>
      </VStack>
    </Box>
  );
}

export default BlogPreview;