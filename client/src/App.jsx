import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import BlogDashboard from './components/BlogDashboard';

function App() {
  return (
    <ChakraProvider>
      <BlogDashboard />
    </ChakraProvider>
  );
}

export default App;