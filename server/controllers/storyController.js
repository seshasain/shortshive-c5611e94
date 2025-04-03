
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// Initialize the Google Generative AI client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Global variable to store the latest animation progress
let progressData = {
  progress: 0,
  currentStep: 1,
  isComplete: false,
};

// Controller function to generate a story from prompt
exports.generateStory = async (req, res) => {
  const { prompt, settings } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  try {
    console.log('Generating story with prompt:', prompt);
    console.log('Settings:', settings);
    
    // Get the Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro-exp-03-25",
    });
    
    // Configuration for generation
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 65536,
      responseModalities: [],
      responseMimeType: "text/plain",
    };
    
    // Create a chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    
    // Construct the prompt with settings
    const fullPrompt = `
      Write a short children's story about: ${prompt}
      
      The story should convey the emotion: ${settings.emotion}
      Language style should be: ${settings.language}
      Voice style should be: ${settings.voiceStyle}
      Approximate story length for ${settings.duration} minutes of narration.
      ${settings.addHook ? 'Include a strong hook at the beginning.' : ''}
      
      The story should be engaging, imaginative, and appropriate for children.
    `;
    
    // Send the message to the model
    const result = await chatSession.sendMessage(fullPrompt);
    const storyText = result.response.text();
    
    // Send the story back to the client
    res.status(200).json({
      story: storyText
    });
    
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story', details: error.message });
  }
};
