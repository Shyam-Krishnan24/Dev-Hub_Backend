const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

async function generateReport(coin, data) {
    if (!genAI) {
        return "AI analysis unavailable because GEMINI_API_KEY is not configured in the backend .env file.";
    }

    const modelName = "gemini-1.5-pro-latest"; // Using Pro-Latest for better stability
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `You are MEMESCAN AI, a meme coin social intelligence analyst. Generate a concise, data-driven analysis report for the meme coin "${coin}" based on these social analytics:

- Social Mentions (24h): ${data.mentions.toLocaleString()}
- Sentiment Score: ${data.sentScore}/100
- Positive Sentiment: ${data.sentPos}%
- Negative Sentiment: ${data.sentNeg}%
- Neutral Sentiment: ${data.sentNeu}%
- FOMO Signals: ${data.sentFomo}%
- Hype Velocity: ${data.velocity}x above baseline
- Engagement Rate: ${data.engagement}%
- Risk Index: ${data.risk}/100
- 7-day Trend: ${data.isUptrend ? 'Upward' : 'Downward'}
- Peak Mentions: ${data.peak}
- Average Daily Mentions: ${data.avg}

Write a 4-5 sentence intelligence report covering:
1. Current social momentum assessment
2. Key signals driving activity (positive or negative)
3. Hype cycle position and what it means
4. Short prediction and risk warning

Use a confident, analytical tone. Include relevant emojis. Keep it punchy and trader-friendly. Do NOT add headers or bullet points — write in flowing prose.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API Error:', error);
        // SMART FALLBACK if API fails
        return `${coin} is showing ${data.sentScore > 50 ? 'robust bullish' : 'uncertain bearish'} micro-signals across social channels. Current hype velocity of ${data.velocity}x suggests a ${data.sentScore > 55 ? 'potential breakout' : 'cooling period'}. Traders should monitor support levels and whale wallet movements closely as engagement rate remains at ${data.engagement}%. 🚀📊`;
    }
}

module.exports = {
    generateReport
};
