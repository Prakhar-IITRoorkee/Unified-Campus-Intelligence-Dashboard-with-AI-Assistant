# Unified Campus Intelligence Dashboard with AI Assistant

## 🚀 Deployed Demo
**[Insert Deployed Link Here]**

## 📖 Project Description
The **Unified Campus Intelligence Dashboard** is a state-of-the-art AI-powered web platform designed to seamlessly integrate various campus services into a single, intuitive interface. 

By leveraging the cutting-edge **Model Context Protocol (MCP)**, this platform dynamically aggregates real-time data from 5 independent campus microservices. A centralized Google Gemini-powered AI Assistant acts as the orchestrator, intelligently routing user queries to the appropriate services to instantly answer questions regarding academics, campus events, cafeteria menus, library availability, and faculty directories. 

## ✨ Features
- **Centralized AI Assistant:** Chat seamlessly with an intelligent agent powered by Google's Gemini that understands natural language and routes queries.
- **Model Context Protocol (MCP) Architecture:** Fully modular system using 5 independent microservice servers, ensuring scalability and strict separation of concerns.
- **Real-Time Data Aggregation:** Instantly fetch and synthesize data from multiple campus domains on the fly.
- **Secure Authentication:** JWT-based user authentication and secure routing.
- **Premium Glassmorphism UI:** A sleek, modern, responsive interface built with raw CSS, featuring dark mode, dynamic gradients, and smooth micro-animations.

## 🛠 Tech Stack
**Frontend:**
- React.js (Vite)
- React Router DOM
- Context API (for Auth state management)
- Vanilla CSS (Glassmorphism & Responsive Design)

**Backend Core:**
- Node.js & Express.js
- `@google/genai` (Gemini SDK)
- JWT (JSON Web Tokens)
- CORS & dotenv

**MCP Microservices:**
- 5x Node.js/Express REST APIs (`mcp-library`, `mcp-cafeteria`, `mcp-events`, `mcp-directory`, `mcp-academics`)

---

## ⚙️ Setup Instructions

Follow these steps to run the complete architecture locally.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn
- A Gemini API Key from Google AI Studio

### 2. Clone the Repository
```bash
git clone https://github.com/Prakhar-IITRoorkee/Unified-Campus-Intelligence-Dashboard-with-AI-Assistant.git
cd Unified-Campus-Intelligence-Dashboard-with-AI-Assistant
```

### 3. Start the MCP Microservices
You must start all 5 independent servers so the AI can fetch data. Open 5 separate terminal windows (or use a multiplexer) and run the following in each:

```bash
# Terminal 1: Library Server (Port 4001)
cd mcp-library
npm install
npm start

# Terminal 2: Cafeteria Server (Port 4002)
cd ../mcp-cafeteria
npm install
npm start

# Terminal 3: Events Server (Port 4003)
cd ../mcp-events
npm install
npm start

# Terminal 4: Directory Server (Port 4004)
cd ../mcp-directory
npm install
npm start

# Terminal 5: Academics Server (Port 4005)
cd ../mcp-academics
npm install
npm start
```

### 4. Start the Main Backend
Open a new terminal window for the main orchestrating backend.
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add your API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=4000
```
Start the backend:
```bash
npm start
```

### 5. Start the Frontend
Open one final terminal window for the React dashboard.
```bash
cd frontend
npm install
npm run dev
```

### 6. Access the Application
Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`). Create an account, log in, and start asking the Unified Campus AI questions!
