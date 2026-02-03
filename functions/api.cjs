require('dotenv').config({ path: './.env.local' }); // Load .env.local file variables

const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const cors = require('cors');
const fs = require('fs').promises; // Use promises-based fs
const path = require('path');

const app = express();
const port = 3001;

const apiKey = process.env.GEMINI_API_KEY; // Corrected to GEMINI_API_KEY
if (!apiKey) {
  console.error("GEMINI_API_KEY environment variable not set. Please ensure it is set in .env.local");
  process.exit(1); // Exit if key is not set
}

// Initialize the AI client
const genAI = new GoogleGenAI(apiKey);

app.use(express.json());
app.use(cors());

// --- Dynamic Knowledge Base ---
// Corrected the path to point to the 'pages' directory from the 'functions' directory
const knowledgeBasePath = path.join(__dirname, '..', 'pages');

const dynamicKnowledgeBase = {
  _content: {},
  _lastUpdated: null,

  async _readFileContent(filePath) {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      // It's okay if some files don't exist, just log it
      console.warn(`Warning: Could not read file ${filePath}. It may not exist.`);
      return "";
    }
  },

  async refreshContent() {
    console.log("Refreshing knowledge base from frontend source code...");
    const filesToScan = [
        'Home.tsx', 
        'AboutUs.tsx', 
        'Recruitment.tsx', 
        'ITSupport.tsx', 
        'BusinessDev.tsx', 
        'PricingPage.tsx'
    ];
    
    const contentPromises = filesToScan.map(file => 
      this._readFileContent(path.join(knowledgeBasePath, file))
    );
    
    const contents = await Promise.all(contentPromises);
    
    this._content['site_content'] = contents.filter(c => c).join('\n\n---\n\n');
    this._lastUpdated = Date.now();
    console.log("Knowledge base refreshed successfully.");
  },

  async getContent() {
    if (!this._lastUpdated || (Date.now() - this._lastUpdated > 3600000)) {
      await this.refreshContent();
    }
    return this._content['site_content'] || "";
  }
};

// --- API Endpoint ---
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const websiteContext = await dynamicKnowledgeBase.getContent();

    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `
      You are "JacksonBot", the friendly and helpful AI assistant for Jackson Multifacet, a recruitment and business services agency.
      Your personality is professional, encouraging, and slightly formal.
      Your primary goal is to answer user questions based *only* on the provided Website Context.
      Do not invent services, pricing, or details. If the answer isn't in the context, say: "I'm sorry, I don't have that information right now, but I can connect you with our team. Please visit the contact page."
      Here is the relevant context from the website:
      --- WEBSITE CONTEXT ---
      ${websiteContext}
      --- END OF CONTEXT ---
      User's Question: "${message}"
      Based *only* on the context above, provide a helpful and concise answer. Structure your response clearly.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ reply: text });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'An internal error occurred. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`JacksonBot API server listening on port ${port}`);
  dynamicKnowledgeBase.refreshContent();
});
