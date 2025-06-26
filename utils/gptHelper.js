require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const Course = require('../models/Course'); // Import the course model
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

const stopwords = new Set([
  "a", "an", "the", "and", "or", "to", "for", "in", "on", "of", "by", "with", "as", "is", "at", "that", "which", "this"
]);

// Function to generate content using Gemini
const getCourseRecommendations = async (query) => {
  try {
    // Customize the prompt to ask Gemini for a concise single paragraph and a limited list of courses
    const prompt = `
    Based on the following query, provide a brief paragraph summary and a short list of courses (max 5 courses):
    Query: "${query}"
    Format your response like this:
    1. First, provide a single paragraph summary explaining the steps or recommendations (maximum of 100 words).
    2. Then, provide a concise list of related courses with their names formatted like:
       1. Course Name: Description (Max 5 courses).
    `;

    // Call Gemini's generateContent method with the customized prompt
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Specify the model to use
      contents: prompt // Pass the structured prompt to guide the response
    });

    // Return the generated text from Gemini
    return response.text;
  } catch (error) {
    console.error('Error with Gemini API:', error.message);
    throw new Error('Unable to fetch course recommendations');
  }
};

const parseGeminiResponse = (responseText, wordLimit = 100, maxCourses = 5) => {
  // Step 1: Split the response into a paragraph and courses list
  const [summary, coursesText] = responseText.split('Here\'s a breakdown of recommended courses:');

  // Step 2: Clean up the summary paragraph (trim whitespace)
  const cleanedSummary = summary.trim();

  // Step 3: Truncate the summary if it exceeds the word limit
  const truncatedSummary = cleanedSummary.split(' ').slice(0, wordLimit).join(' ');

  // Step 4: Clean and extract the courses list
  // Extracting courses using a regex that looks for numbered or bullet points
  const courseRegex = /\d+\.\s*([A-Za-z\s]+):\s*([A-Za-z\s,]+)(?:\s*\-\s*(https?:\/\/[^\s]+))?/g;
  let courses = [];
  let match;

  // Extract all courses from the response
  while ((match = courseRegex.exec(coursesText)) !== null) {
    if (courses.length < maxCourses) {  // Limit the number of courses to `maxCourses`
      courses.push({
        name: match[1], // Course Name
        description: match[2], // Description
        link: match[3] || null // Link if available
      });
    }
  }

  // Return the parsed data
  return {
    paragraph: truncatedSummary, // Truncated summary paragraph
    courses: courses // List of courses (limited)
  };
};


// Function to filter available courses based on GPT-3/Gemini suggestions
const filterAvailableCourses = async (gptCourses) => {
  try {
    // Extract topics from GPT-3/Gemini response and get top 10 relevant topics (e.g., courses names or key skills)
    const topics = gptCourses.map(course => course.name.toLowerCase()); // Extract course names for matching 
    
    // Query the database to find courses that match any of the topics in their title or description
    const courses = await Course.find({
      $or: [
        { title: { $regex: new RegExp(topics.join('|'), 'i') } }, // Case-insensitive match for titles
        { description: { $regex: new RegExp(topics.join('|'), 'i') } } // Case-insensitive match for descriptions
      ]
    });

    // Return the filtered courses
    return courses;
  } catch (error) {
    console.error('Error filtering courses:', error.message);
    throw new Error('Unable to filter courses');
  }
};

module.exports = { getCourseRecommendations, filterAvailableCourses, parseGeminiResponse };
