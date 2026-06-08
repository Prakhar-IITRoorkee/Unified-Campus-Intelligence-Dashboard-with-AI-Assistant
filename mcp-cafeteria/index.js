const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

const menu = {
  monday: { lunch: 'Grilled Chicken & Rice', dinner: 'Pasta Bolognese', special: 'Vegan Burger' },
  tuesday: { lunch: 'Tacos', dinner: 'Steak & Fries', special: 'Falafel Wrap' },
  wednesday: { lunch: 'Pizza', dinner: 'Roast Turkey', special: 'Salad Bar' },
  thursday: { lunch: 'Sushi Bowls', dinner: 'Chicken Curry', special: 'Tofu Stir Fry' },
  friday: { lunch: 'Fish & Chips', dinner: 'BBQ Ribs', special: 'Veggie Pizza' }
};

app.get('/api/menu', (req, res) => {
  const day = req.query.day?.toLowerCase();
  if (day && menu[day]) {
    return res.json({ day, menu: menu[day] });
  }
  res.json(menu);
});

app.listen(PORT, () => {
  console.log(`🍔 Cafeteria MCP Server running on port ${PORT}`);
});
