const express = require('express');
const axios = require('axios');
const app = express();
const port = 8008;

async function fetchNumbersFromUrl(url) {
  try {
    const response = await axios.get(url, { timeout: 500 });
    return response.data.numbers || [];
  } catch (error) {
    return [];
  }
}

async function mergeUniqueNumbers(urls) {
  const tasks = urls.map(fetchNumbersFromUrl);
  const numbersLists = await Promise.all(tasks);
  const mergedNumbers = [...new Set(numbersLists.flat())].sort((a, b) => a - b);
  return mergedNumbers;
}

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  if (!urls || !Array.isArray(urls)) {
    return res.json({ numbers: [] });
  }

  try {
    const mergedUniqueNumbers = await mergeUniqueNumbers(urls);
    return res.json({ numbers: mergedUniqueNumbers });
  } catch (error) {
    console.error('Error processing the URLs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
