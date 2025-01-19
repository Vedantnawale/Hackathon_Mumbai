import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // or the appropriate plugin for your framework
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Add polyfill options here if needed
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      // Add any other aliases if needed
    },
  },
});
