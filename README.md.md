# Sunny Kitchen

Restaurant / cloud kitchen website with online ordering, table booking, offers, an AI "what should I eat today?" suggester and an order chatbot.

**Stack:** HTML, CSS, JavaScript (frontend) · Node.js + Express (backend) · MongoDB + Mongoose (database)

## Run it

1. Install Node.js 18 or newer and MongoDB (or create a free MongoDB Atlas database).
2. In this folder:

```bash
npm install
cp .env.example .env      # then edit .env
npm run seed              # adds the sample menu and offers
npm start                 # open http://localhost:3000
```

## AI features

Both AI features work out of the box with a simple built-in fallback.
To switch on the real AI, put your Claude API key in `.env`:

```
ANTHROPIC_API_KEY=your-key-here
```

The key stays on the server (`routes/ai.js`) and is never sent to the browser.

## Pages

| Page | File |
|------|------|
| Home + AI suggester | `public/index.html` |
| Menu | `public/menu.html` |
| Order online (cart and checkout) | `public/order.html` |
| Table booking | `public/booking.html` |
| Offers | `public/offers.html` |
| Contact / About | `public/contact.html` |

The chatbot ("Sunny Assistant") is the floating button on every page (`public/js/app.js`).

## Things to change before going live

- Address, phone and timings (footer in `public/js/app.js`, and `contact.html`).
- Menu items and prices (`seed.js`), then run `npm run seed` again.
- Coupons (`seed.js`).
- Add an admin login before building an admin dashboard.
