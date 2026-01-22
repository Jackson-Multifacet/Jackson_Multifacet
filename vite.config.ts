import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  resolve: {
    alias: {
      'react': 'https://esm.sh/react@18.2.0',
      'react-dom/client': 'https://esm.sh/react-dom@18.2.0/client?deps=react@18.2.0',
      'react-dom': 'https://esm.sh/react-dom@18.2.0?deps=react@18.2.0',
      'react/jsx-runtime': 'https://esm.sh/react@18.2.0/jsx-runtime',
      'react-router-dom': 'https://esm.sh/react-router-dom@6.18.0?deps=react@18.2.0,react-dom@18.2.0',
      'framer-motion': 'https://esm.sh/framer-motion@10.16.4?deps=react@18.2.0,react-dom@18.2.0',
      'lucide-react': 'https://esm.sh/lucide-react@0.292.0?deps=react@18.2.0',
      'firebase/app': 'https://esm.sh/firebase@10.7.1/app',
      'firebase/firestore': 'https://esm.sh/firebase@10.7.1/firestore',
      '@google/genai': 'https://esm.sh/@google/genai@0.1.0',
      'react-markdown': 'https://esm.sh/react-markdown@9.0.1?deps=react@18.2.0'
    }
  },
  define: {
    'process.env': {}
  }
});