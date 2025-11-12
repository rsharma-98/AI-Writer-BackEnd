const OpenAI = require('openai');

// Check for API Key immediately on file load
if (!process.env.OPENAI_API_KEY) {
    // A better approach in production would be to throw an error and prevent server start
    console.error("CRITICAL: OPENAI_API_KEY is not set in environment variables.");
}

const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
});

const getSuggestion = async (req, res) => {
    try {
        const { text } = req.body;
        
        // 1. Validation for required field
        if (!text) {
            return res.status(400).json({ 
                success: false, 
                message: "Bad Request: 'text' field is required in the request body." 
            });
        }

        // 2. OpenAI API Call
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful writing assistant. Reply with concise 2-3 line summaries." },
                { role: "user", content: text },
            ],
            max_tokens: 120,
            temperature: 0.7,
        });

        // 3. Extract and respond with suggestion
        const suggestion = response.choices[0]?.message?.content?.trim() || "No suggestion available";
        res.json({ success: true, suggestion });

    } catch (err) {
        // 4. Robust Error Handling (The primary flow change)
        
        // Log the full error for server debugging
        console.error('AI Service Error:', err); 

        // Check if the error is an OpenAI API error with a status code
        if (err instanceof OpenAI.APIError) {
            // Examples: 401 Unauthorized (invalid API key), 429 Rate Limit, 400 Bad Request
            const status = err.status || 500;
            return res.status(status).json({ 
                success: false, 
                error: `OpenAI API Error: ${err.message}` 
            });
        }

        // Catch all other internal/unexpected server errors (e.g., network issues)
        res.status(500).json({ 
            success: false, 
            error: 'Internal Server Error: Could not process request.' 
        });
    }
};

module.exports = {
    getSuggestion,
};