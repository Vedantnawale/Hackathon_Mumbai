import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyDEgHVzUWCoK0MVru27TPQNbAde4l8T7TM');

export const translateContent = async (text, targetLanguage) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Translate the following English text to ${targetLanguage}. Ensure high accuracy and maintain the original meaning:\n\n${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};