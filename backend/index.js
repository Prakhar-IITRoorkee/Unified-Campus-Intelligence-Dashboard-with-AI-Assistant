const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'API Gateway is running' }));
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
