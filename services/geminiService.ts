
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateBlogPost = async (topic: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return Promise.resolve("AI Content Generation is disabled. Please configure your API key.");
    }
    
    try {
        const prompt = `Generate a compelling and well-structured blog post about "${topic}". The post should have a clear introduction, several body paragraphs with insightful points, and a concluding summary. The tone should be professional yet engaging. Format it in simple HTML with paragraphs <p>, bold <b>, and unordered lists <ul><li>.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating blog post:", error);
        throw new Error("Failed to generate content from AI. Please check the console for details.");
    }
};
