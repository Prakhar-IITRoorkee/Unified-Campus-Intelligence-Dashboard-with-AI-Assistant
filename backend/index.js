require('dotenv').config();
const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campus_intelligence').then(() => console.log('✅ Connected to MongoDB')).catch((err) => console.error('❌ MongoDB connection error:', err.message));


app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);

// Initialize Google Gen AI
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

// Define MCP Tools
const tools = [
  {
    name: 'query_library',
    description: 'Query the campus library system for book availability.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The title or author of the book to search for.' }
      },
      required: ['query']
    }
  },
  {
    name: 'query_cafeteria',
    description: 'Query the campus cafeteria for the menu on a specific day.',
    parameters: {
      type: 'object',
      properties: {
        day: { type: 'string', description: 'The day of the week (e.g., monday, tuesday).' }
      },
      required: ['day']
    }
  }
];

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (process.env.GEMINI_API_KEY === 'dummy_key' || !process.env.GEMINI_API_KEY) {
       // Mock response when API key is missing
       return res.json({ reply: `Mock AI: I received your message "${message}". In production, I would use tool calling to contact the MCP servers.` });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: { tools: [{ functionDeclarations: tools }] }
    });

    const funcCall = response.functionCalls?.[0];
    
    if (funcCall) {
      const { name, args } = funcCall;
      let mcpResponse = {};
      
      // Route to respective MCP Microservice
      if (name === 'query_library') {
        const libRes = await fetch(`http://localhost:4001/api/books?q=${args.query}`);
        mcpResponse = await libRes.json();
      } else if (name === 'query_cafeteria') {
        const cafRes = await fetch(`http://localhost:4002/api/menu?day=${args.day}`);
        mcpResponse = await cafRes.json();
      }

      // Return tool response to LLM
      const finalResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: 'user', parts: [{ text: message }] },
            { role: 'model', parts: [{ functionCall: funcCall }] },
            { role: 'user', parts: [{ functionResponse: { name, response: mcpResponse } }] }
        ]
      });
      
      return res.json({ reply: finalResponse.text });
    }

    res.json({ reply: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

app.get('/health', (req, res) => {
    res.json({ status: 'API Gateway is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway & AI Router running on port ${PORT}`);
});
