
require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const Offer = require('./models/Offer');

// Food image URL generator
const foodImage = (tags, lock) =>
  `https://loremflickr.com/800/600/${tags}?lock=${lock}`;

// ==========================================
// COMPLETE RESTAURANT MENU
// ==========================================

const menu = [

  // ========================================
  // INDIAN STARTERS
  // ========================================
{
    name: 'Paneer Tikka',
    category: 'Starters',
    description: 'Smoky tandoor-grilled paneer with peppers and mint chutney.',
    price: 220,
    veg: true,
    spice: 2,
    emoji: '🧀',
    popular: true,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgmQOYA-YJRU8K0eFjecaBTkHNsIXdY5Vd655daoLUiw&s=10'
},
  {
    name: 'Veg Spring Rolls',
    category: 'Starters',
    description: 'Crispy rolls stuffed with seasoned vegetables.',
    price: 160, veg: true, spice: 1, emoji: '🥟',
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlnVfidHTIMIVneIyS6piFms8dlgu5mW1m6jq3LRgasg&s=10"
  },
  {
    name: 'Chicken 65',
    category: 'Starters',
    description: 'Spicy, crunchy South Indian fried chicken with curry leaves.',
    price: 240, veg: false, spice: 3, emoji: '🍗',
    popular: true,
    image: "https://images.openai.com/static-rsc-4/08yuJLf97Tkolplu6sCvIxzumx_WyOTQECDUibiD1AranxtHhI86556fYAG2iwN6QMfUCwWOcY1LmbYm9igLMErsghbI_R80Fm1469z_gLcshNIhdiSU6h7V1WM1A6UV7AhdbknTIRyIDp-uYAyS7oUptOlFjLzf0xgMC3YWtf4GdIZhO8V_5HbSXdHExLJu?purpose=fullsize"
  },
  {
    name: 'Hara Bhara Kebab',
    category: 'Starters',
    description: 'Spinach and green pea patties, lightly pan-fried.',
    price: 180, veg: true, spice: 1, emoji: '🥬',
    image: foodImage('hara,bhara,kebab', 4)
  },
  {
    name: 'Veg Manchurian Dry',
    category: 'Starters',
    description: 'Crispy vegetable balls tossed in spicy Chinese sauce.',
    price: 190, veg: true, spice: 2, emoji: '🥗',
    popular: true,
    image: foodImage('veg,manchurian', 5)
  },
  {
    name: 'Chicken Tikka',
    category: 'Starters',
    description: 'Juicy chicken pieces marinated in Indian spices and grilled.',
    price: 280, veg: false, spice: 2, emoji: '🍗',
    image: foodImage('chicken,tikka', 6)
  },
  {
    name: 'Onion Pakoda',
    category: 'Starters',
    description: 'Crispy onion fritters served with chutney.',
    price: 120, veg: true, spice: 2, emoji: '🧅',
    image: foodImage('indian,onion,pakora', 7)
  },

  // ========================================
  // INDIAN MAIN COURSE
  // ========================================

  {
    name: 'Butter Chicken',
    category: 'Mains',
    description: 'Tender chicken in a rich, creamy tomato and butter gravy.',
    price: 320, veg: false, spice: 1, emoji: '🍛',
    popular: true,
    image: foodImage('indian,butter,chicken', 8)
  },
  {
    name: 'Paneer Butter Masala',
    category: 'Mains',
    description: 'Soft paneer cubes in a velvety tomato-cashew gravy.',
    price: 280, veg: true, spice: 1, emoji: '🍲',
    popular: true,
    image: foodImage('paneer,butter,masala', 9)
  },
  {
    name: 'Dal Tadka',
    category: 'Mains',
    description: 'Yellow lentils tempered with garlic, cumin and ghee.',
    price: 180, veg: true, spice: 1, emoji: '🥘',
    image: foodImage('indian,dal,tadka', 10)
  },
  {
    name: 'Chana Masala',
    category: 'Mains',
    description: 'Chickpeas simmered in tangy onion-tomato masala.',
    price: 190, veg: true, spice: 2, emoji: '🫘',
    image: foodImage('chana,masala', 11)
  },
  {
    name: 'Kadai Chicken',
    category: 'Mains',
    description: 'Chicken cooked with bell peppers and freshly ground spices.',
    price: 310, veg: false, spice: 3, emoji: '🌶️',
    image: foodImage('kadai,chicken', 12)
  },
  {
    name: 'Palak Paneer',
    category: 'Mains',
    description: 'Paneer in a smooth, lightly spiced spinach gravy.',
    price: 260, veg: true, spice: 1, emoji: '🥗',
    image: foodImage('palak,paneer', 13)
  },
  {
    name: 'Shahi Paneer',
    category: 'Mains',
    description: 'Paneer cooked in rich creamy cashew and tomato gravy.',
    price: 290, veg: true, spice: 1, emoji: '🍲',
    popular: true,
    image: foodImage('shahi,paneer', 14)
  },
  {
    name: 'Malai Kofta',
    category: 'Mains',
    description: 'Soft vegetable dumplings in creamy cashew gravy.',
    price: 270, veg: true, spice: 1, emoji: '🥘',
    image: foodImage('malai,kofta', 15)
  },
  {
    name: 'Kadai Paneer',
    category: 'Mains',
    description: 'Paneer with capsicum, onion and kadai spices.',
    price: 280, veg: true, spice: 2, emoji: '🍛',
    image: foodImage('kadai,paneer', 16)
  },
  {
    name: 'Chicken Korma',
    category: 'Mains',
    description: 'Chicken cooked in a mild and creamy aromatic gravy.',
    price: 330, veg: false, spice: 1, emoji: '🍗',
    image: foodImage('chicken,korma', 17)
  },

  // ========================================
  // BIRYANI
  // ========================================

  {
    name: 'Veg Biryani',
    category: 'Biryani',
    description: 'Fragrant basmati layered with vegetables and whole spices. Served with raita.',
    price: 240, veg: true, spice: 2, emoji: '🍚',
    image: foodImage('vegetable,biryani', 18)
  },
  {
    name: 'Chicken Biryani',
    category: 'Biryani',
    description: 'Slow-cooked dum biryani with juicy chicken. Served with raita.',
    price: 300, veg: false, spice: 2, emoji: '🍗',
    popular: true,
    image: foodImage('chicken,biryani', 19)
  },
  {
    name: 'Egg Biryani',
    category: 'Biryani',
    description: 'Spiced basmati rice with masala-coated boiled eggs.',
    price: 250, veg: false, spice: 2, emoji: '🥚',
    image: foodImage('egg,biryani', 20)
  },
  {
    name: 'Hyderabadi Chicken Biryani',
    category: 'Biryani',
    description: 'Traditional aromatic dum biryani with spicy chicken.',
    price: 340, veg: false, spice: 3, emoji: '🍛',
    popular: true,
    image: foodImage('hyderabadi,chicken,biryani', 21)
  },

  // ========================================
  // BREADS
  // ========================================

  {
    name: 'Butter Naan',
    category: 'Breads',
    description: 'Soft tandoor-baked naan brushed with butter.',
    price: 55, veg: true, spice: 0, emoji: '🫓',
    popular: true,
    image: foodImage('butter,naan', 22)
  },
  {
    name: 'Garlic Naan',
    category: 'Breads',
    description: 'Naan topped with fresh garlic and coriander.',
    price: 65, veg: true, spice: 0, emoji: '🧄',
    image: foodImage('garlic,naan', 23)
  },
  {
    name: 'Tandoori Roti',
    category: 'Breads',
    description: 'Whole wheat roti baked in the tandoor.',
    price: 30, veg: true, spice: 0, emoji: '🍞',
    image: foodImage('tandoori,roti', 24)
  },

  // ========================================
  // DESSERTS
  // ========================================

  {
    name: 'Gulab Jamun',
    category: 'Desserts',
    description: 'Warm milk dumplings soaked in cardamom sugar syrup (2 pieces).',
    price: 90, veg: true, spice: 0, emoji: '🍮',
    popular: true,
    image: foodImage('gulab,jamun', 25)
  },
  {
    name: 'Rasmalai',
    category: 'Desserts',
    description: 'Soft paneer discs in chilled saffron milk (2 pieces).',
    price: 110, veg: true, spice: 0, emoji: '🥛',
    image: foodImage('rasmalai', 26)
  },
  {
    name: 'Kulfi Falooda',
    category: 'Desserts',
    description: 'Traditional kulfi with falooda noodles and rose syrup.',
    price: 130, veg: true, spice: 0, emoji: '🍨',
    image: foodImage('kulfi,falooda', 27)
  },
  {
    name: 'Chocolate Brownie',
    category: 'Desserts',
    description: 'Rich chocolate brownie served with chocolate sauce.',
    price: 150, veg: true, spice: 0, emoji: '🍫',
    image: foodImage('chocolate,brownie', 28)
  },

  // ========================================
  // DRINKS
  // ========================================

  {
    name: 'Mango Lassi',
    category: 'Drinks',
    description: 'Thick, chilled yogurt drink blended with ripe mango.',
    price: 90, veg: true, spice: 0, emoji: '🥭',
    popular: true,
    image: foodImage('mango,lassi', 29)
  },
  {
    name: 'Masala Chai',
    category: 'Drinks',
    description: 'Hot tea simmered with ginger, cardamom and spices.',
    price: 40, veg: true, spice: 0, emoji: '☕',
    image: foodImage('masala,chai', 30)
  },
  {
    name: 'Fresh Lime Soda',
    category: 'Drinks',
    description: 'Sweet or salted, fizzy and refreshing.',
    price: 70, veg: true, spice: 0, emoji: '🍋',
    image: foodImage('lime,soda', 31)
  },

  // ========================================
  // CHINESE VEG STARTERS
  // ========================================

  {
    name: 'Veg Manchurian',
    category: 'Chinese',
    description: 'Crispy vegetable balls tossed in delicious Indo-Chinese sauce.',
    price: 190, veg: true, spice: 2, emoji: '🥗',
    popular: true,
    image: foodImage('veg,manchurian,chinese', 32)
  },
  {
    name: 'Gobi Manchurian',
    category: 'Chinese',
    description: 'Crispy cauliflower florets tossed in spicy Manchurian sauce.',
    price: 180, veg: true, spice: 2, emoji: '🥦',
    image: foodImage('gobi,manchurian', 33)
  },
  {
    name: 'Paneer Chilli',
    category: 'Chinese',
    description: 'Fried paneer cubes tossed with capsicum, onion and chilli sauce.',
    price: 220, veg: true, spice: 3, emoji: '🌶️',
    popular: true,
    image: foodImage('paneer,chilli', 34)
  },
  {
    name: 'Crispy Corn',
    category: 'Chinese',
    description: 'Crunchy golden corn tossed with spices and herbs.',
    price: 170, veg: true, spice: 2, emoji: '🌽',
    image: foodImage('crispy,corn', 35)
  },
  {
    name: 'Chilli Mushroom',
    category: 'Chinese',
    description: 'Mushrooms tossed with green chillies and Chinese sauces.',
    price: 210, veg: true, spice: 3, emoji: '🍄',
    image: foodImage('chilli,mushroom', 36)
  },
  {
    name: 'Honey Chilli Potato',
    category: 'Chinese',
    description: 'Crispy potato fingers coated with honey and chilli sauce.',
    price: 180, veg: true, spice: 2, emoji: '🍟',
    popular: true,
    image: foodImage('honey,chilli,potato', 37)
  },
  {
    name: 'Veg Crispy',
    category: 'Chinese',
    description: 'Crispy fried vegetables tossed in spicy Chinese seasoning.',
    price: 190, veg: true, spice: 2, emoji: '🥕',
    image: foodImage('crispy,vegetables', 38)
  },
  {
    name: 'American Chopsuey',
    category: 'Chinese',
    description: 'Crispy noodles topped with sweet and sour vegetable gravy.',
    price: 220, veg: true, spice: 1, emoji: '🍜',
    image: foodImage('american,chopsuey', 39)
  },

  // ========================================
  // CHINESE NON-VEG STARTERS
  // ========================================

  {
    name: 'Chicken Manchurian',
    category: 'Chinese',
    description: 'Juicy chicken pieces tossed in spicy Manchurian sauce.',
    price: 250, veg: false, spice: 2, emoji: '🍗',
    popular: true,
    image: foodImage('chicken,manchurian', 40)
  },
  {
    name: 'Chicken Lollipop',
    category: 'Chinese',
    description: 'Crispy fried chicken lollipops with spicy coating.',
    price: 260, veg: false, spice: 3, emoji: '🍗',
    popular: true,
    image: foodImage('chicken,lollipop', 41)
  },
  {
    name: 'Chilli Chicken Dry',
    category: 'Chinese',
    description: 'Boneless chicken tossed with capsicum, onion and chilli sauce.',
    price: 260, veg: false, spice: 3, emoji: '🌶️',
    image: foodImage('chilli,chicken,dry', 42)
  },
  {
    name: 'Chicken Crispy',
    category: 'Chinese',
    description: 'Crunchy fried chicken strips tossed with Chinese seasoning.',
    price: 270, veg: false, spice: 2, emoji: '🍗',
    image: foodImage('crispy,fried,chicken', 43)
  },
  {
    name: 'Chicken 555',
    category: 'Chinese',
    description: 'Spicy fried chicken tossed with aromatic Indian-Chinese spices.',
    price: 280, veg: false, spice: 3, emoji: '🍗',
    image: foodImage('spicy,chicken,fry', 44)
  },

  // ========================================
  // CHINESE NOODLES
  // ========================================

  {
    name: 'Veg Hakka Noodles',
    category: 'Chinese',
    description: 'Stir-fried noodles with fresh vegetables and Chinese sauces.',
    price: 180, veg: true, spice: 1, emoji: '🍜',
    popular: true,
    image: foodImage('veg,hakka,noodles', 45)
  },
  {
    name: 'Schezwan Noodles',
    category: 'Chinese',
    description: 'Spicy noodles tossed in homemade Schezwan sauce.',
    price: 200, veg: true, spice: 3, emoji: '🍜',
    image: foodImage('schezwan,noodles', 46)
  },
  {
    name: 'Singapore Noodles',
    category: 'Chinese',
    description: 'Thin noodles stir-fried with vegetables and aromatic spices.',
    price: 210, veg: true, spice: 2, emoji: '🍝',
    image: foodImage('singapore,noodles', 47)
  },
  {
    name: 'Chicken Hakka Noodles',
    category: 'Chinese',
    description: 'Hakka noodles tossed with chicken, vegetables and sauces.',
    price: 240, veg: false, spice: 2, emoji: '🍜',
    popular: true,
    image: foodImage('chicken,hakka,noodles', 48)
  },
  {
    name: 'Egg Hakka Noodles',
    category: 'Chinese',
    description: 'Stir-fried noodles with scrambled eggs and vegetables.',
    price: 210, veg: false, spice: 1, emoji: '🍳',
    image: foodImage('egg,hakka,noodles', 49)
  },
  {
    name: 'Chicken Schezwan Noodles',
    category: 'Chinese',
    description: 'Spicy Schezwan noodles with chicken and vegetables.',
    price: 260, veg: false, spice: 3, emoji: '🍜',
    image: foodImage('chicken,schezwan,noodles', 50)
  },

  // ========================================
  // CHINESE FRIED RICE
  // ========================================

  {
    name: 'Veg Fried Rice',
    category: 'Chinese',
    description: 'Classic fried rice with fresh vegetables and Chinese sauces.',
    price: 180, veg: true, spice: 1, emoji: '🍚',
    popular: true,
    image: foodImage('vegetable,fried,rice', 51)
  },
  {
    name: 'Schezwan Fried Rice',
    category: 'Chinese',
    description: 'Fried rice tossed in spicy Schezwan sauce.',
    price: 200, veg: true, spice: 3, emoji: '🍚',
    image: foodImage('schezwan,fried,rice', 52)
  },
  {
    name: 'Singapore Fried Rice',
    category: 'Chinese',
    description: 'Flavourful rice tossed with vegetables and aromatic spices.',
    price: 210, veg: true, spice: 2, emoji: '🍚',
    image: foodImage('singapore,fried,rice', 53)
  },
  {
    name: 'Chicken Fried Rice',
    category: 'Chinese',
    description: 'Stir-fried rice with chicken, egg and vegetables.',
    price: 240, veg: false, spice: 1, emoji: '🍗',
    popular: true,
    image: foodImage('chicken,fried,rice', 54)
  },
  {
    name: 'Egg Fried Rice',
    category: 'Chinese',
    description: 'Classic fried rice with scrambled eggs and spring onions.',
    price: 210, veg: false, spice: 1, emoji: '🍳',
    image: foodImage('egg,fried,rice', 55)
  },
  {
    name: 'Triple Schezwan Rice',
    category: 'Chinese',
    description: 'Fried rice, noodles and spicy Schezwan gravy served together.',
    price: 280, veg: false, spice: 3, emoji: '🍛',
    popular: true,
    image: foodImage('triple,schezwan,rice', 56)
  },

  // ========================================
  // CHINESE GRAVY
  // ========================================

  {
    name: 'Veg Manchurian Gravy',
    category: 'Chinese',
    description: 'Vegetable dumplings in a flavourful Chinese gravy.',
    price: 200, veg: true, spice: 2, emoji: '🥘',
    image: foodImage('veg,manchurian,gravy', 57)
  },
  {
    name: 'Paneer Chilli Gravy',
    category: 'Chinese',
    description: 'Paneer cubes cooked in spicy chilli gravy.',
    price: 230, veg: true, spice: 3, emoji: '🍲',
    image: foodImage('paneer,chilli,gravy', 58)
  },
  {
    name: 'Chicken Manchurian Gravy',
    category: 'Chinese',
    description: 'Chicken balls cooked in delicious Manchurian gravy.',
    price: 270, veg: false, spice: 2, emoji: '🍗',
    image: foodImage('chicken,manchurian,gravy', 59)
  },
  {
    name: 'Chicken Hot Garlic',
    category: 'Chinese',
    description: 'Chicken cooked in a hot garlic sauce with vegetables.',
    price: 280, veg: false, spice: 3, emoji: '🌶️',
    image: foodImage('chicken,hot,garlic,sauce', 60)
  },

  // ========================================
  // CHINESE SOUPS
  // ========================================

  {
    name: 'Veg Manchow Soup',
    category: 'Chinese',
    description: 'Spicy vegetable soup topped with crispy noodles.',
    price: 110, veg: true, spice: 2, emoji: '🍜',
    image: foodImage('vegetable,manchow,soup', 61)
  },
  {
    name: 'Veg Sweet Corn Soup',
    category: 'Chinese',
    description: 'Creamy sweet corn soup with fresh vegetables.',
    price: 100, veg: true, spice: 0, emoji: '🥣',
    image: foodImage('sweet,corn,soup', 62)
  },
  {
    name: 'Veg Hot and Sour Soup',
    category: 'Chinese',
    description: 'Hot and sour soup with mushrooms and vegetables.',
    price: 110, veg: true, spice: 3, emoji: '🥣',
    image: foodImage('hot,sour,soup', 63)
  },
  {
    name: 'Chicken Manchow Soup',
    category: 'Chinese',
    description: 'Spicy chicken soup with vegetables and crispy noodles.',
    price: 130, veg: false, spice: 2, emoji: '🍲',
    image: foodImage('chicken,manchow,soup', 64)
  },
  {
    name: 'Chicken Sweet Corn Soup',
    category: 'Chinese',
    description: 'Warm chicken and sweet corn soup.',
    price: 130, veg: false, spice: 0, emoji: '🥣',
    image: foodImage('chicken,sweet,corn,soup', 65)
  },

  // ========================================
  // CHINESE COMBOS
  // ========================================

  {
    name: 'Veg Noodles Combo',
    category: 'Chinese',
    description: 'Veg Hakka noodles served with Veg Manchurian.',
    price: 260, veg: true, spice: 2, emoji: '🍱',
    popular: true,
    image: foodImage('noodles,manchurian,combo', 66)
  },
  {
    name: 'Chicken Rice Combo',
    category: 'Chinese',
    description: 'Chicken fried rice served with Chicken Manchurian gravy.',
    price: 320, veg: false, spice: 2, emoji: '🍱',
    popular: true,
    image: foodImage('chicken,rice,combo', 67)
  },
  {
    name: 'Veg Schezwan Combo',
    category: 'Chinese',
    description: 'Schezwan fried rice served with Veg Manchurian gravy.',
    price: 280, veg: true, spice: 3, emoji: '🍱',
    image: foodImage('schezwan,rice,manchurian', 68)
  }
];

// ==========================================
// SPECIAL OFFERS
// ==========================================

const inDays = (n) =>
  new Date(Date.now() + n * 24 * 60 * 60 * 1000);

const offers = [
  {
    title: 'Welcome Sunny!',
    description: '20% off your first order, up to ₹150.',
    code: 'SUNNY20',
    discountPercent: 20,
    minOrder: 300,
    maxDiscount: 150,
    validTill: inDays(365)
  },
  {
    title: 'Family Feast',
    description: '15% off on orders above ₹800. Perfect for sharing.',
    code: 'FEAST15',
    discountPercent: 15,
    minOrder: 800,
    maxDiscount: 250,
    validTill: inDays(365)
  },
  {
    title: 'Weekend Treat',
    description: '10% off any order over ₹400, every weekend.',
    code: 'WEEKEND10',
    discountPercent: 10,
    minOrder: 400,
    maxDiscount: 100,
    validTill: inDays(365)
  }
];

// ==========================================
// MONGODB SEED FUNCTION
// ==========================================

async function run() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
      'mongodb://127.0.0.1:27017/sunny_kitchen'
    );

    console.log('MongoDB connected successfully!');

    // Clear previous data
    await MenuItem.deleteMany({});
    await Offer.deleteMany({});

    console.log('Old menu and offers cleared.');

    // Insert new menu
    await MenuItem.insertMany(menu);

    // Insert offers
    await Offer.insertMany(offers);

    console.log('--------------------------------');
    console.log(`Total dishes: ${menu.length}`);
    console.log(`Total offers: ${offers.length}`);
    console.log('Indian and Chinese menu added!');
    console.log('--------------------------------');

    await mongoose.disconnect();

    console.log('MongoDB disconnected successfully.');

  } catch (err) {
    console.error('Seeding error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

run();
