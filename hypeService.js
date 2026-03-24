const { spawn } = require('child_process');
const path = require('path');

/**
 * Hype and Velocity calculation service.
 * Bridging to Python models.
 */

async function calculateHypeMetrics(coin) {
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

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                resolve({ velocity: 1.0, engagement: 2.5, risk: 20 }); // Fallback
                return;
            }
            try {
                const results = JSON.parse(dataString);
                // Map Python hype results to backend schema
                resolve({
                    velocity: results.hype?.velocity || 1.0,
                    engagement: results.hype?.sentiment_mean * 10 || 5.0, // Scaled for UI
                    risk: Math.min(100, (1 - results.prediction?.confidence) * 100) || 30
                });
            } catch (err) {
                resolve({ velocity: 1.2, engagement: 4.5, risk: 35 });
            }
        });
    });
}

module.exports = {
    calculateHypeMetrics
};
