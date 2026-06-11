import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { Bot, Send, User, BookOpen, Coffee, Calendar, Server, LogOut, Menu, Plus, MessageSquare, X } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

/* ─── Protected Route Wrapper ─── */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-spinner-lg" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/* ─── Dashboard ─── */
const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello! I'm your Unified Campus AI. Ask me about library books or today's cafeteria menu." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  /* Load chat history */
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/chats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChats(res.data);
      } catch (err) {
        console.error('Failed to load chats:', err);
      }
    };
    if (token) fetchChats();
  }, [token]);

  /* Create new chat */
  const createNewChat = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/chats',
        { title: `Chat ${new Date().toLocaleString()}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChats(prev => [res.data, ...prev]);
      setActiveChatId(res.data._id);
      setMessages([{ sender: 'bot', text: "Hello! I'm your Unified Campus AI. Ask me about library books or today's cafeteria menu." }]);
      setChatHistoryOpen(false);
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  };

  /* Load a specific chat */
  const loadChat = (chat) => {
    setActiveChatId(chat._id);
    setMessages(
      chat.messages && chat.messages.length > 0
        ? chat.messages
        : [{ sender: 'bot', text: "Hello! I'm your Unified Campus AI. Ask me about library books or today's cafeteria menu." }]
    );
    setChatHistoryOpen(false);
  };

  /* Delete a chat */
  const deleteChat = async (e, chatId) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:4000/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(prev => prev.filter(c => c._id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([{ sender: 'bot', text: "Hello! I'm your Unified Campus AI. Ask me about library books or today's cafeteria menu." }]);
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  /* Send message */
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    /* If no active chat, create one first */
    let currentChatId = activeChatId;
    if (!currentChatId) {
      try {
        const res = await axios.post('http://localhost:4000/api/chats',
          { title: userMsg.substring(0, 40) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        currentChatId = res.data._id;
        setActiveChatId(currentChatId);
        setChats(prev => [res.data, ...prev]);
      } catch (err) {
        console.error('Failed to auto-create chat:', err);
      }
    }

    /* Save user message */
    if (currentChatId) {
      try {
        await axios.put(`http://localhost:4000/api/chats/${currentChatId}`,
          { sender: 'user', text: userMsg },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Failed to save user message:', err);
      }
    }

    try {
      const response = await axios.post('http://localhost:4000/api/chat', { message: userMsg });
      const botReply = response.data.reply;
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);

      /* Save bot response */
      if (currentChatId) {
        try {
          await axios.put(`http://localhost:4000/api/chats/${currentChatId}`,
            { sender: 'bot', text: botReply },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error('Failed to save bot message:', err);
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error connecting to the AI Router.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Mobile hamburger */}
      <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="logo">
          <h2>Campus.IQ</h2>
        </div>
        <ul className="nav-links">
          <li className="active"><Server size={20} /> Dashboard</li>
          <li><BookOpen size={20} /> Library MCP</li>
          <li><Coffee size={20} /> Cafeteria MCP</li>
          <li><Calendar size={20} /> Events MCP</li>
        </ul>
        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} /> Logout
          </button>
          <div className="user-profile">
            <div className="avatar"><User size={24} /></div>
            <span>{user?.name || 'Student'}</span>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <header className="header">
          <h1>Welcome back, {user?.name || 'Student'}!</h1>
          <p>Real-time data aggregated via Model Context Protocol</p>
        </header>

        <section className="dashboard-grid">
          <div className="card glass-effect">
            <h3>Active MCP Connections</h3>
            <div className="status-indicator online">Library Server (Port 4001)</div>
            <div className="status-indicator online">Cafeteria Server (Port 4002)</div>
            <div className="status-indicator online">Events Server (Port 4003)</div>
          </div>
          <div className="card hero-card glass-effect">
            <h2>Decentralized Data. Unified Interface.</h2>
            <p>Instead of a monolithic database, data is fetched live from independent microservices using tool-calling.</p>
          </div>
        </section>

        <section className="chat-section">
          {/* Chat History Panel */}
          <div className={`chat-history-panel glass-effect ${chatHistoryOpen ? 'open' : ''}`}>
            <div className="chat-history-header">
              <h3><MessageSquare size={18} /> History</h3>
              <button className="new-chat-btn" onClick={createNewChat} title="New Chat">
                <Plus size={18} />
              </button>
            </div>
            <div className="chat-history-list">
              {chats.length === 0 ? (
                <p className="no-chats">No conversations yet</p>
              ) : (
                chats.map(chat => (
                  <div
                    key={chat._id}
                    className={`chat-history-item ${activeChatId === chat._id ? 'active' : ''}`}
                    onClick={() => loadChat(chat)}
                  >
                    <MessageSquare size={14} />
                    <span className="chat-title">{chat.title || 'Untitled'}</span>
                    <button className="delete-chat-btn" onClick={(e) => deleteChat(e, chat._id)} title="Delete">
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Main Chat */}
          <div className="chat-container glass-effect">
            <div className="chat-header">
              <button className="chat-history-toggle" onClick={() => setChatHistoryOpen(!chatHistoryOpen)}>
                <MessageSquare size={20} />
              </button>
              <Bot size={24} />
              <h3>Ask Campus AI</h3>
              <button className="new-chat-btn-header" onClick={createNewChat} title="New Chat">
                <Plus size={18} /> New
              </button>
            </div>
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender}`}>
                  <div className="message-content">{msg.text}</div>
                </div>
              ))}
              {loading && <div className="message bot"><div className="message-content loading">Routing query to MCP servers...</div></div>}
              <div ref={messagesEndRef} />
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
          </div>
        </section>
      </main>
    </div>
  );
};

/* ─── App Router ─── */
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
