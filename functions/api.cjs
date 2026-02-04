require('dotenv').config({ path: './.env.local' });

const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// SECURITY: Use Helmet to set various HTTP headers for protection
app.use(helmet());

// SECURITY: Rate Limiting to prevent brute-force and DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY environment variable not set.");
  process.exit(1);
}

const genAI = new GoogleGenAI(apiKey);

app.use(express.json());

// SECURITY: CORS Configuration - specify allowed origins in production
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const knowledgeBasePath = path.join(__dirname, '..', 'pages');

const dynamicKnowledgeBase = {
  _content: {},
  _lastUpdated: null,

  async _readFileContent(filePath) {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      console.warn(`Warning: Could not read file ${filePath}.`);
      return "";
    }
  },

  async refreshContent() {
    console.log("Refreshing knowledge base...");
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
  },

  async getContent() {
    if (!this._lastUpdated || (Date.now() - this._lastUpdated > 3600000)) {
      await this.refreshContent();
    }
    return this._content['site_content'] || "";
  }
};

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Valid message is required' });
  }

  // SECURITY: Basic input length check
  if (message.length > 500) {
    return res.status(400).json({ error: 'Message too long' });
  }

  try {
    const websiteContext = await dynamicKnowledgeBase.getContent();
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `
      You are "JacksonBot", the AI assistant for Jackson Multifacet.
      Answer questions based ONLY on the provided Context.
      If the answer isn't in the context, say you don't have that info and suggest the contact page.
      --- CONTEXT ---
      ${websiteContext}
      --- QUESTION ---
      ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ reply: response.text() });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  dynamicKnowledgeBase.refreshContent();
});
