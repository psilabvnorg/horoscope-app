const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Ollama proxy endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { model, prompt, stream = false } = req.body;
    
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama error:', errorText);
      return res.status(response.status).json({ 
        error: 'Ollama service error',
        details: errorText
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to connect to Ollama',
      message: error.message,
      fallback: true
    });
  }
});

// Check Ollama availability
app.get('/api/ollama/status', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { timeout: 5000 });
    if (response.ok) {
      const data = await response.json();
      res.json({ available: true, models: data.models || [] });
    } else {
      res.json({ available: false, error: 'Ollama not responding' });
    }
  } catch (error) {
    res.json({ available: false, error: error.message });
  }
});

// Content endpoints - serve pre-generated content
app.get('/api/content/:type/:sign/:gender/:day', (req, res) => {
  const { type, sign, gender, day } = req.params;
  
  // Generate deterministic content based on parameters
  const content = generateContent(type, sign, gender, parseInt(day));
  res.json(content);
});

// Deck endpoint for swipe cards
app.get('/api/deck', (req, res) => {
  const { acceptedTraits, rejectedTraits } = req.query;
  
  // Return personalized deck
  const deck = generateDeck(
    acceptedTraits ? acceptedTraits.split(',') : [],
    rejectedTraits ? rejectedTraits.split(',') : []
  );
  
  res.json({ deck });
});

// Swipe endpoint
app.post('/api/swipe', (req, res) => {
  const { traitId, direction, userId } = req.body;
  
  // In a real app, this would save to a database
  // For now, we just acknowledge the swipe
  res.json({ success: true, traitId, direction });
});

// Tarot daily card endpoint
app.get('/api/tarot/daily', (req, res) => {
  const { sign } = req.query;
  const card = getDailyTarotCard(sign);
  res.json(card);
});

// Couple compatibility endpoint
app.get('/api/couple/:signA/:signB', (req, res) => {
  const { signA, signB } = req.params;
  const compatibility = generateCompatibility(signA, signB);
  res.json(compatibility);
});

// Fortune endpoint
app.get('/api/fortune/:topic', (req, res) => {
  const { topic } = req.params;
  const { sign } = req.query;
  const fortune = generateFortune(topic, sign);
  res.json(fortune);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Content generation functions
function generateContent(type, sign, gender, day) {
  const messages = {
    today: [
      "The stars align in your favor today. Trust your instincts and seize opportunities.",
      "A surprise encounter may lead to something wonderful. Keep your heart open.",
      "Your energy is magnetic today. Others are drawn to your positive aura.",
    ],
    love: [
      "New romance blooms on the horizon. Be open to unexpected connections.",
      "Your soulmate may be closer than you think. Open your eyes to possibilities.",
      "Self-love attracts the right partner. Focus on being your best self.",
    ],
    career: [
      "Your hard work pays off with recognition. Celebrate your achievements.",
      "A mentor appears to guide your path. Be open to learning.",
      "New opportunities expand your horizons. Say yes to growth.",
    ],
    money: [
      "Unexpected financial gains brighten your day. Use wisdom with windfalls.",
      "Smart investments made now pay off later. Think long-term.",
      "A new income stream presents itself. Explore all opportunities.",
    ]
  };

  const typeMessages = messages[type] || messages.today;
  const message = typeMessages[day % typeMessages.length];
  
  return {
    id: `${type}-${sign}-${gender}-${day}`,
    type,
    sign,
    gender,
    title: `${capitalize(type)} Guidance`,
    short: message.slice(0, 160),
    deep: message,
    score: 70 + (day % 25),
    tags: [type, 'guidance', 'cosmic'],
    variants: [message]
  };
}

function generateDeck(acceptedTraits, rejectedTraits) {
  const allTraits = [
    { id: 'ambitious', trait: 'Ambitious', description: 'You set high goals and work tirelessly to achieve them.', category: 'personality', emoji: '🎯' },
    { id: 'intuitive', trait: 'Intuitive', description: 'You trust your gut feelings and often sense things before they happen.', category: 'personality', emoji: '🔮' },
    { id: 'creative', trait: 'Creative', description: 'Your imagination knows no bounds. You see beauty everywhere.', category: 'personality', emoji: '🎨' },
    { id: 'loyal', trait: 'Loyal', description: 'Once you commit, you stay true. Your friends know you\'ll always be there.', category: 'personality', emoji: '🤝' },
    { id: 'adventurous', trait: 'Adventurous', description: 'You crave new experiences and aren\'t afraid to step outside your comfort zone.', category: 'personality', emoji: '🌍' },
    { id: 'patient', trait: 'Patient', description: 'You understand that good things take time. You wait with grace.', category: 'personality', emoji: '🧘' },
    { id: 'passionate', trait: 'Passionate', description: 'You throw yourself fully into what you love. Your enthusiasm is contagious.', category: 'personality', emoji: '🔥' },
    { id: 'analytical', trait: 'Analytical', description: 'You think deeply before acting. Every decision is carefully considered.', category: 'personality', emoji: '🧠' },
  ];

  return allTraits.filter(t => !rejectedTraits.includes(t.id));
}

function getDailyTarotCard(sign) {
  const cards = [
    { id: 0, name: 'The Fool', meaning: 'A new journey begins. Trust in the universe.' },
    { id: 1, name: 'The Magician', meaning: 'You have all the tools you need. Manifest your desires.' },
    { id: 2, name: 'The High Priestess', meaning: 'Trust your inner voice. Secrets may be revealed.' },
    { id: 3, name: 'The Empress', meaning: 'Creativity and abundance flow through you.' },
    { id: 4, name: 'The Emperor', meaning: 'Stability and order serve you now.' },
  ];
  
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const seed = dayOfYear + (sign ? sign.charCodeAt(0) : 0);
  return cards[seed % cards.length];
}

function generateCompatibility(signA, signB) {
  const seed = signA.charCodeAt(0) + signB.charCodeAt(0);
  const score = 50 + (seed % 45);
  
  return {
    signA,
    signB,
    score,
    strengths: ['Deep emotional understanding', 'Complementary energies', 'Shared values'],
    weaknesses: ['Occasional power struggles', 'Different communication styles'],
    dailyMessage: 'Today brings opportunities to deepen your connection.'
  };
}

function generateFortune(topic, sign) {
  const fortunes = {
    future: ['Great things await you on the horizon.', 'Your path is illuminated by starlight.'],
    love: ['Love finds you when you least expect it.', 'Your heart is ready for connection.'],
    career: ['New opportunities will present themselves soon.', 'Your skills are being recognized.'],
    money: ['Financial abundance flows toward you.', 'Wise investments bring rewards.'],
    life: ['Personal growth accelerates through new experiences.', 'Inner peace comes from acceptance.']
  };
  
  const topicFortunes = fortunes[topic] || fortunes.life;
  const seed = sign ? sign.charCodeAt(0) : 0;
  return {
    topic,
    content: topicFortunes[seed % topicFortunes.length],
    date: new Date().toISOString()
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

app.listen(PORT, () => {
  console.log(`Horos server running on port ${PORT}`);
  console.log(`Ollama base URL: ${OLLAMA_BASE_URL}`);
});
