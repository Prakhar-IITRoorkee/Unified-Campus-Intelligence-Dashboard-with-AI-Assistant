const express = require('express');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error('Get chats error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve chats.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, messages } = req.body;

    const chat = await Chat.create({
      userId: req.user.id,
      title: title || 'New Chat',
      messages: messages || [],
    });

    res.status(201).json(chat);
  } catch (err) {
    console.error('Create chat error:', err.message);
    res.status(500).json({ error: 'Failed to create chat.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.sender || !message.text) {
      return res.status(400).json({ error: 'Message must have sender and text fields.' });
    }

    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        $push: {
          messages: {
            sender: message.sender,
            text: message.text,
            timestamp: message.timestamp || new Date(),
          },
        },
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    res.json(chat);
  } catch (err) {
    console.error('Update chat error:', err.message);
    res.status(500).json({ error: 'Failed to update chat.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    res.json({ message: 'Chat deleted successfully.' });
  } catch (err) {
    console.error('Delete chat error:', err.message);
    res.status(500).json({ error: 'Failed to delete chat.' });
  }
});

module.exports = router;
