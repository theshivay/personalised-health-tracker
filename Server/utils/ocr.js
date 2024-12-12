const Tesseract = require('tesseract.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs").promises;
const path = require('path');

async function extractTextFromImage(imagePath) {
    try {
        // console.log('Processing file:', path.resolve(imagePath));

        // Perform OCR on the image
        // const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
        //     logger: (info) => console.log(info), // Logs progress
        // });
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        // console.log('Raw Extracted Text:', text);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const image = await fs.readFile(imagePath);
            const imageParts = [
                {
                    inlineData: {
                        data: image.toString("base64"),
                        mimeType: "image/jpeg", // Adjust based on your image type
                    },
                },
            ];

            // const prompt =
            //     "Extract numeric values and key details from the medical report and format them as JSON.";
            const prompt =
                "Extract key data points and their corresponding numeric values from a given health report and format them as JSON.";

            const result = await model.generateContent([prompt, ...imageParts]);
            const response = result.response;
            const rawText = response.text();

            console.log("\nRaw Response: ", rawText);

            // Preprocess the text to remove code block markers
            const cleanedText = rawText.replace(/```json|```/g, "").trim();

            // Use RegExp to match key-value pairs more reliably
            // const keyValuePattern = /^([^:]+):\s*(.+)$/gm;

            // const keyValuePairs = {};
            // cleanedText.match(keyValuePattern)?.forEach((line) => {
            //     const [, key, value] = line.match(/^([^:]+):\s*(.+)$/) || [];
            //     if (key && value) {
            //         keyValuePairs[key.trim()] = value.trim();
            //     }
            // });

            // Beautify the JSON result
            const final_text = JSON.parse(cleanedText);
            console.log('Parsed Key-Value Pairs:', final_text);

            return final_text;
        } catch (error) {
            console.error('OCR Extraction Error:', error.message);
            return {}; // Return empty object on failure
        }
    }

module.exports = { extractTextFromImage };
