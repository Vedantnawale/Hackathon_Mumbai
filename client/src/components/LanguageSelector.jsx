import React from 'react';
import { Select, FormControl, FormLabel } from '@chakra-ui/react';

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

function LanguageSelector({ selectedLanguage, onChange }) {
  return (
    <FormControl>
      <FormLabel>Select Language</FormLabel>
      <Select
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

export default LanguageSelector;