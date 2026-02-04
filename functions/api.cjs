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

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
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

  if (message.length > 500) {
    return res.status(400).json({ error: 'Message too long' });
  }

  try {
    const websiteContext = await dynamicKnowledgeBase.getContent();
    // Apply a moderate temperature for a balanced conversational style
    const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig: { temperature: 0.5 } });

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
    console.error('[Chat API] Error processing request:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error occurred while processing your request.' });
  }
});

// New endpoint for Career Copilot resume evaluation
app.post('/api/career-copilot-evaluate', async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'Resume text and job description are required.' });
  }

  // Basic length checks
  if (resumeText.length > 10000 || jobDescription.length > 2000) {
    return res.status(400).json({ error: 'Input too long. Resume max 10k chars, Job Description max 2k chars.' });
  }

  try {
    // Use a lower temperature for more factual and less creative evaluation
    const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig: { temperature: 0.3 } });

    const prompt = `
      You are an expert career consultant providing feedback on a candidate's resume against a specific job description.
      Analyze the provided resume and job description. Provide:
      1. A compatibility score (out of 100).
      2. Strengths of the resume relevant to the job.
      3. Areas for improvement in the resume to better match the job description.
      4. Keywords from the job description that are missing or underrepresented in the resume.

      --- RESUME TEXT ---
      ${resumeText}
      --- JOB DESCRIPTION ---
      ${jobDescription}
      --- EVALUATION ---
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ evaluation: response.text() });

  } catch (error) {
    console.error('[Career Copilot API] Error processing request:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error occurred during resume evaluation.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  dynamicKnowledgeBase.refreshContent();
});
