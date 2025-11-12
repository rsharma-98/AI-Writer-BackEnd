const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { getSuggestion } = require('../controller/ai.controller');



// Simple AI endpoint: receives { text, keywords }
// If OPENAI_API_KEY is set, it will call OpenAI's completion endpoint (chat completions).
// Otherwise it returns a mocked suggestion.
router.post('/suggest', auth, getSuggestion);

module.exports = router;
