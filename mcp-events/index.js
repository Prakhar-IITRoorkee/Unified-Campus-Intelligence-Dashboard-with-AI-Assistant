require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors());
app.use(express.json());

// Mock campus events data
const events = [
  {
    id: 1,
    title: 'TechFest 2026',
    date: '2026-07-15',
    time: '10:00 AM - 6:00 PM',
    location: 'Main Auditorium',
    club: 'Computer Science Society',
    description:
      'Annual technology festival featuring project exhibitions, coding contests, tech talks by industry leaders, and a startup pitch competition.',
  },
  {
    id: 2,
    title: 'Cultural Night: Colors of Campus',
    date: '2026-07-20',
    time: '6:00 PM - 10:00 PM',
    location: 'Open Air Theatre',
    club: 'Cultural Committee',
    description:
      'A vibrant evening celebrating diversity with dance performances, musical acts, poetry recitals, and a fashion show representing cultures from around the world.',
  },
  {
    id: 3,
    title: 'HackCampus 24-Hour Hackathon',
    date: '2026-08-02',
    time: '9:00 AM (Sat) - 9:00 AM (Sun)',
    location: 'Innovation Lab, Block C',
    club: 'Developer Student Club',
    description:
      'A 24-hour hackathon where teams of up to 4 build solutions for real-world campus problems. Prizes worth ₹50,000 and mentorship from tech professionals.',
  },
  {
    id: 4,
    title: 'AI & Machine Learning Workshop',
    date: '2026-07-25',
    time: '2:00 PM - 5:00 PM',
    location: 'Seminar Hall 2',
    club: 'AI Research Group',
    description:
      'Hands-on workshop covering neural networks, natural language processing, and computer vision using Python and TensorFlow. Open to all skill levels.',
  },
  {
    id: 5,
    title: 'Inter-College Sports Tournament',
    date: '2026-08-10',
    time: '8:00 AM - 6:00 PM',
    location: 'University Sports Complex',
    club: 'Sports Council',
    description:
      'Annual inter-college sports tournament featuring cricket, football, basketball, badminton, and athletics. Over 15 colleges competing for the Champions Trophy.',
  },
];

/**
 * GET /api/events
 * Returns all events; supports optional ?q= query to filter by title, club, or description.
 */
app.get('/api/events', (req, res) => {
  try {
    const query = req.query.q?.toLowerCase();

    if (query) {
      const results = events.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.club.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query)
      );
      return res.json(results);
    }

    res.json(events);
  } catch (err) {
    console.error('Events query error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve events.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Events MCP Server is running' });
});

app.listen(PORT, () => {
  console.log(`📅 Events MCP Server running on port ${PORT}`);
});
