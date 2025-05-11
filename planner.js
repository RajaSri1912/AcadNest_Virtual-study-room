// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // to use .env file

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// POST endpoint to send prompt to OpenAI
app.post('/generate-planner', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer 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`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data.choices[0].message.content);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate planner' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
