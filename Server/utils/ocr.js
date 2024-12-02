const Tesseract = require('tesseract.js');
const path = require('path');

async function extractTextFromImage(imagePath) {
    try {
        console.log('Processing file:', path.resolve(imagePath));

        const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
            logger: (info) => console.log(info), // Logs progress
        });

        console.log('Extracted Text:', text);
        const keyValuePairs = text.split('\n').reduce((acc, line) => {
            const [key, value] = line.split(':').map((item) => item?.trim());
            if (key && value) acc[key] = value;
            return acc;
          }, {});
        return keyValuePairs;
    } catch (error) {
        console.error('OCR Extraction Error:', error.message);
        return {}; // Return empty object on failure
    }
}

module.exports = { extractTextFromImage };