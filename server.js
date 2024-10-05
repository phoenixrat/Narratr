require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Use cors middleware
app.use(cors());

app.use(express.json());
app.use(express.static('public'));

const API_BASE_URL = 'https://api.fish.audio';
const API_KEY = process.env.FISH_AUDIO_API_KEY;

// Add this route before your other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/models', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/model`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

app.post('/tts', async (req, res) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/v1/tts`, req.body, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    });
    res.set('Content-Type', 'audio/mp3');
    res.send(response.data);
  } catch (error) {
    console.error('Error details:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate speech', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});