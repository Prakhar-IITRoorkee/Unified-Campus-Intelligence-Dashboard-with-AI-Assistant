require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4004;

app.use(cors());
app.use(express.json());

const directory = [
  { id: 1, name: 'Dr. Sharma', department: 'Computer Science', email: 'sharma@cs.iitr.ac.in', phone: '+91-1332-285001', office: 'Block C, Room 204', officeHours: 'Mon-Wed 2-4 PM' },
  { id: 2, name: 'Prof. Gupta', department: 'Electrical Engineering', email: 'gupta@ee.iitr.ac.in', phone: '+91-1332-285002', office: 'Block E, Room 101', officeHours: 'Tue-Thu 10-12 AM' },
  { id: 3, name: 'Dr. R. K. Singh', department: 'Mathematics', email: 'rksingh@math.iitr.ac.in', phone: '+91-1332-285003', office: 'Block M, Room 305', officeHours: 'Fri 1-3 PM' }
];

app.get('/api/directory', (req, res) => {
  const query = req.query.q?.toLowerCase();
  if (query) {
    const results = directory.filter(p => p.name.toLowerCase().includes(query) || p.department.toLowerCase().includes(query));
    return res.json(results);
  }
  res.json(directory);
});

app.listen(PORT, () => {
  console.log(`👨‍🏫 Directory MCP Server running on port ${PORT}`);
});
