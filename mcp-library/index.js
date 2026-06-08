const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

const books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', available: true, location: 'Shelf A1' },
  { id: 2, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', available: false, location: 'Shelf B4' },
  { id: 3, title: 'Design Patterns', author: 'Erich Gamma', available: true, location: 'Shelf C2' }
];

app.get('/api/books', (req, res) => {
  const query = req.query.q?.toLowerCase();
  if (query) {
    const results = books.filter(b => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query));
    return res.json(results);
  }
  res.json(books);
});

app.listen(PORT, () => {
  console.log(`📚 Library MCP Server running on port ${PORT}`);
});
