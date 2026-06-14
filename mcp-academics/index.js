require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4005;

app.use(cors());
app.use(express.json());

const academics = [
  { courseCode: 'CS101', name: 'Data Structures', credits: 4, prerequisites: 'None', instructor: 'Dr. Sharma' },
  { courseCode: 'CS202', name: 'Operating Systems', credits: 4, prerequisites: 'CS101', instructor: 'Prof. Verma' },
  { courseCode: 'EE101', name: 'Basic Electrical', credits: 3, prerequisites: 'None', instructor: 'Prof. Gupta' }
];

app.get('/api/academics', (req, res) => {
  const query = req.query.q?.toLowerCase();
  if (query) {
    const results = academics.filter(c => c.name.toLowerCase().includes(query) || c.courseCode.toLowerCase().includes(query));
    return res.json(results);
  }
  res.json(academics);
});

app.listen(PORT, () => {
  console.log(`🎓 Academics MCP Server running on port ${PORT}`);
});
