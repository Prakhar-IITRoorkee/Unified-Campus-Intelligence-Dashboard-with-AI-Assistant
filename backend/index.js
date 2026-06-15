require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campus_intelligence')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);

const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

const tools = [
  {
    name: 'query_library',
    description: 'Query the campus library system for book availability.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'A single concise keyword from the book title or author. Do not pass conversational phrases.' }
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
  },
  {
    name: 'query_events',
    description: 'Search for upcoming campus events, fests, hackathons, workshops, and sports tournaments.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'A specific concise search term (e.g., "hackathon", "sports"). If the user asks for general upcoming events, pass an empty string "" to fetch all events.' }
      },
      required: ['query']
    }
  },
  {
    name: 'query_directory',
    description: 'Search the faculty directory for professors, emails, offices, and hours.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'ONLY the concise last name of the professor (e.g. "sharma", NOT "professor sharma" or "sharma\'s") or department name.' }
      },
      required: ['query']
    }
  },
  {
    name: 'query_academics',
    description: 'Search for courses, credits, and prerequisites.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'ONLY the strict course code (e.g., "CS101", "CS202") or exact course name. Do not include words like "prerequisites".' }
      },
      required: ['query']
    }
  }
];

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    
    if (process.env.GEMINI_API_KEY === 'dummy_key' || !process.env.GEMINI_API_KEY) {
       
       return res.json({ reply: `Mock AI: I received your message "${message}". In production, I would use tool calling to contact the MCP servers.` });
    }

    const contents = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: { tools: [{ functionDeclarations: tools }] }
    });

    const funcCall = response.functionCalls?.[0];
    
    if (funcCall) {
      const { name, args } = funcCall;
      let mcpResponse = {};

      const libraryUrl = process.env.MCP_LIBRARY_URL || 'http://localhost:4001';
      const cafeteriaUrl = process.env.MCP_CAFETERIA_URL || 'http://localhost:4002';
      const eventsUrl = process.env.MCP_EVENTS_URL || 'http://localhost:4003';
      const directoryUrl = process.env.MCP_DIRECTORY_URL || 'http://localhost:4004';
      const academicsUrl = process.env.MCP_ACADEMICS_URL || 'http://localhost:4005';

      if (name === 'query_library') {
        const libRes = await fetch(`${libraryUrl}/api/books?q=${args.query}`);
        mcpResponse = await libRes.json();
      } else if (name === 'query_cafeteria') {
        const cafRes = await fetch(`${cafeteriaUrl}/api/menu?day=${args.day}`);
        mcpResponse = await cafRes.json();
      } else if (name === 'query_events') {
        const evtRes = await fetch(`${eventsUrl}/api/events?q=${encodeURIComponent(args.query)}`);
        mcpResponse = await evtRes.json();
      } else if (name === 'query_directory') {
        const dirRes = await fetch(`${directoryUrl}/api/directory?q=${encodeURIComponent(args.query)}`);
        mcpResponse = await dirRes.json();
      } else if (name === 'query_academics') {
        const acadRes = await fetch(`${academicsUrl}/api/academics?q=${encodeURIComponent(args.query)}`);
        mcpResponse = await acadRes.json();
      }

      const finalContents = [
        ...contents,
        { role: 'model', parts: [{ functionCall: funcCall }] },
        { role: 'user', parts: [{ functionResponse: { name, response: { result: mcpResponse } } }] }
      ];

      const finalResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: finalContents
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
