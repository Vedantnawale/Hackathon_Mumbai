import React from 'react';
import { Box, VStack, Heading, Text } from '@chakra-ui/react';

function BlogList({ blogs }) {
  return (
    <VStack spacing={4} align="stretch">
      {blogs.map((blog) => (
        <Box key={blog.id} borderWidth="1px" borderRadius="lg" p={4} shadow="sm">
          <Heading as="h3" size="md" mb={2}>
            {blog.title} <Text as="span" fontSize="sm" color="gray.500">({blog.language})</Text>
          </Heading>
          <Text>{blog.content}</Text>
        </Box>
      ))}
    </VStack>
  );
}

export default BlogList;
