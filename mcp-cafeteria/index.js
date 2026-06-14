const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

const menu = {
  monday: {
    breakfast: 'White Sause Pasta, Tomato Sause, Sandwich (Self Prepared), Chocos',
    lunch: 'Arhar Dal, Bhindi Masala, Veg Biriyani with Nutri, Boondi Raita (150 gm), Roohafza, Fryums, Watrmelon (150 gm)',
    dinner: 'Dal Urad, Aloo Jeera, Kathal Masala, Gulab Jamun'
  },
  tuesday: {
    breakfast: 'Idli Fried/Plain, Coconut Chutney, Sambhar, Cornflakes',
    lunch: 'Dal Garlic Tadka, Mix Veg, Matar Vegetable Khichadi, Dahi (150 gm), Muskmelon',
    dinner: 'Dal Urad Chana, Chhola, Ajwine Puri/Plain, Sweet Kaddu, Plain Rice, Sewai Kheer'
  },
  wednesday: {
    breakfast: 'Poha Namkeen, Jalebi, Imli Chutney, CornFlakes',
    lunch: 'Rajmah Raseela, Soya keema, Jeera Rice, Plain Rice, Fruit Custard',
    dinner: 'Kadhai Paneer/Mughlai Chicken, Dal Makhani, Jeera Rice, Chocolate Ice-cream (100 ml)'
  },
  thursday: {
    breakfast: 'Chhole, Samosa, Chopped Onion, Tomato, GreenChutney, Sandwich (Self Prepared), Cornflakes, Dahi/milk',
    lunch: 'Kadhi Pyaj Pakoda, Mix Kathoul, Kali Masoor, Fryums, Vinegar Onion, Nimbu Paani, Watrmelon (150 gm)',
    dinner: 'Dal Panchratan, Bati, Churma, Moong Kofta, Matar Pulao'
  },
  friday: {
    breakfast: 'Suji Halwa, Kala Chana, Chocos, Sandwich (Self Prepared)',
    lunch: 'Dal Garlic Tadka, Louki Chana, Arbi Masala, Banana Shake (150 gm)',
    dinner: 'Dal Malka Masoor, Soya Chap/Egg Keema (02 PC), Jeera Rice, Motichoor Laddu (01pc)'
  },
  saturday: {
    breakfast: 'Masala Dosa, Sambhar, Coconut Chutney, Sandwich (Self Prepared), CornFlakes',
    lunch: 'Punjabi Chhola, Bhatura, Aloo Matar semi Dry, Garlic Tomato Chutney, Boondi Raita (150 gm), Onion Salad, Pineapple(125 gm)Shikanji',
    dinner: 'Dal Arhar, Fried Rice, Hakka Noodles, Manchurian, Vanila ICce-cream (100 ml)'
  },
  sunday: {
    breakfast: 'Aloo Pyaj Paratha, Aloo Curry, Tomato Chutney, Dahi/milk',
    lunch: 'Cabbage Matar Dry, Moong Dal, Tori Chana, Lemon Rice, Nimbu Pani, Papaya(125 gm)',
    dinner: 'Paneer Biryani (60gm)/Chicken Biryani(150 gm), Dal Makhani, Veg Raita, Moong Halwa'
  }
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
