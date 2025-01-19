import React from 'react';
import { Progress } from '@chakra-ui/react';

function TranslationProgress({ translations, languages, isTranslating }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Translations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map((lang) => (
          <div
            key={lang.code}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300"
          >
            <h3 className="font-semibold text-gray-800 mb-2">
              {lang.name}
            </h3>
            {isTranslating ? (
              <Progress size="sm" isIndeterminate className="rounded-full" />
            ) : translations[lang.code] ? (
              <p className="text-gray-600 line-clamp-3">
                {translations[lang.code]}
              </p>
            ) : (
              <p className="text-gray-400 italic">
                Translation not available
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TranslationProgress;