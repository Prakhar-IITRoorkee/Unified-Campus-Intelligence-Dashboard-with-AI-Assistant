import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { Bot, Send, User, BookOpen, Coffee, Calendar, Server } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello! I'm your Unified Campus AI. Ask me about library books or today's cafeteria menu." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:4000/api/chat', { message: userMsg });
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error connecting to the AI Router.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <nav className="sidebar">
        <div className="logo">
          <h2>Campus.IQ</h2>
        </div>
        <ul className="nav-links">
          <li className="active"><Server size={20} /> Dashboard</li>
          <li><BookOpen size={20} /> Library MCP</li>
          <li><Coffee size={20} /> Cafeteria MCP</li>
          <li><Calendar size={20} /> Events MCP</li>
        </ul>
        <div className="user-profile">
          <div className="avatar"><User size={24} /></div>
          <span>Student</span>
        </div>
      </nav>

      <main className="main-content">
        <header className="header">
          <h1>Unified Intelligence Dashboard</h1>
          <p>Real-time data aggregated via Model Context Protocol</p>
        </header>

        <section className="dashboard-grid">
          <div className="card glass-effect">
            <h3>Active MCP Connections</h3>
            <div className="status-indicator online">Library Server (Port 4001)</div>
            <div className="status-indicator online">Cafeteria Server (Port 4002)</div>
            <div className="status-indicator offline">Events Server (Pending)</div>
          </div>
          <div className="card hero-card glass-effect">
            <h2>Decentralized Data. Unified Interface.</h2>
            <p>Instead of a monolithic database, data is fetched live from independent microservices using tool-calling.</p>
          </div>
        </section>

        <section className="chat-container glass-effect">
          <div className="chat-header">
            <Bot size={24} />
            <h3>Ask Campus AI</h3>
          </div>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                <div className="message-content">{msg.text}</div>
              </div>
            ))}
            {loading && <div className="message bot"><div className="message-content loading">Routing query to MCP servers...</div></div>}
          </div>
          <form className="chat-input-form" onSubmit={sendMessage}>
            <input 
              type="text" 
              placeholder="e.g. Is 'Clean Code' available? or What's for lunch on monday?" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              disabled={loading}
            />
            <button type="submit" disabled={loading} className="send-btn">
              <Send size={20} />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
