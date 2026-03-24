const { spawn } = require('child_process');
const path = require('path');

/**
 * Sentiment analysis service.
 * Bridging to Python models.
 */

function analyzeSentiment(coin) {
    return new Promise((resolve, reject) => {
        const pythonPath = path.join(__dirname, '..', '..', '.venv', 'Scripts', 'python.exe');
        const pythonProcess = spawn(pythonPath, [
            path.join(__dirname, '..', 'ai_bridge.py'),
            coin
        ]);

        let dataString = '';
        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data.toString()}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                resolve({ positive: 45, negative: 10, neutral: 45, fomo: 20, score: 55 }); // Fallback
                return;
            }
            try {
                const results = JSON.parse(dataString);
                resolve(results.sentiment || results);
            } catch (err) {
                resolve({ positive: 45, negative: 10, neutral: 45, fomo: 20, score: 55 });
            }
        });
    });
}

module.exports = {
    analyzeSentiment
};
